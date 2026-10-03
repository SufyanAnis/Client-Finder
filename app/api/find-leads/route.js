// app/api/find-leads/route.js
// Server-side: holds the secret key(s) and runs the live prospecting call.
// Anthropic/Gemini search the web themselves; Groq has no native search, so we
// run a Tavily search first and feed the results to the model.
//
// Paywall: every visitor gets LIMITS.freeSearches (default 1) free search, ever;
// after that each search costs one credit from a license key bought via Safepay
// (header x-fmc-key, see lib/credits). Failures are refunded. Public results stop
// at 5 leads with no automatic contact enrichment (one extra web search per lead,
// so it is on demand via /api/lookup-contact). The signed-in owner is unlimited.

import { generate, MISSING_KEY_MESSAGE, activeProvider, providerHasNativeSearch } from "../../../lib/llm";
import { searchAvailable, webSearch, ATS_DOMAINS, NOISE_DOMAINS } from "../../../lib/search";
import { roleFor } from "../../../lib/services";
import { LIMITS, take, takeLifetime, refundLifetime, visitorId, cacheGet, cacheSet } from "../../../lib/ratelimit";
import { spendCredit, refundCredit, getBalance, paywallEnabled } from "../../../lib/credits";
import { refund } from "../../../lib/ratelimit";
import { isOwner, verifyTurnstile, CAPACITY_MESSAGE } from "../../../lib/guard";
import { enrichContacts } from "../../../lib/enrich";

export const runtime = "nodejs";
export const maxDuration = 60; // web search + generation can take a while; Hobby allows up to 60s

const CACHE_TTL = 60 * 60 * 12; // identical searches within 12h reuse the result
const clip = (v, n) => (typeof v === "string" ? v.trim().slice(0, n) : "");

// Two searches, each aimed at a different kind of demand signal:
//  1. companies' own job posts for the role this service covers (ATS-hosted,
//     so every hit names a real hiring company), and
//  2. last month's news about funding, launches and expansion in the niche.
// Marketplaces and aggregators are excluded — they're never the end client.
const SEARCHES_PER_RUN = 2;

async function gatherSignals({ service, geo, niche }) {
  const role = roleFor(service);
  const sector = niche || "";
  const [jobs, news] = await Promise.all([
    webSearch(`${role} ${sector} ${geo}`.replace(/\s+/g, " "), 8, { includeDomains: ATS_DOMAINS }).catch(() => []),
    webSearch(`${sector || "startup"} company ${geo} raises funding OR launches OR expands OR opens new`, 8, {
      topic: "news", timeRange: "month", excludeDomains: NOISE_DOMAINS,
    }).catch(() => []),
  ]);
  const out = [
    ...jobs.map((r) => ({ ...r, kind: "company job post" })),
    ...news.map((r) => ({ ...r, kind: "news" })),
  ];
  // Local niches (clinics, restaurants…) rarely post on ATS pages or make the
  // news, so top up thin results with one broader search.
  let extra = 0;
  if (jobs.length < 4) {
    extra = 1;
    // New and expanding local businesses are the classic buyers of a site,
    // SEO, branding or marketing — the opening itself is the trigger.
    const more = await webSearch(
      `new ${sector || "business"} opening in ${geo} "now open" OR "grand opening" OR "new location" OR "opening soon"`, 8,
      { timeRange: "year", excludeDomains: [...NOISE_DOMAINS, "yelp.com", "yellowpages.com", "tripadvisor.com", "facebook.com", "instagram.com"] }
    ).catch(() => []);
    out.push(...more.map((r) => ({ ...r, kind: "opening / expansion" })));
  }
  return { results: out, extra };
}

function buildPrompt({ n, service, geo, niche, size, searchContext }) {
  const sourceLine = searchContext
    ? `Using ONLY the web search results below, identify up to ${n} REAL companies that show an ACTIVE NEED for "${service}" right now. Do NOT invent companies that don't appear in the results.`
    : `Use web search to find ${n} REAL companies that show an ACTIVE NEED for "${service}" right now.`;

  let p =
`You are a senior B2B prospecting researcher helping an independent provider of "${service}" (a freelancer or small agency) find clients. Today is ${new Date().toISOString().slice(0, 10)}.
${sourceLine}
Targeting — geography: ${geo}; industry/niche: ${niche || "any relevant sector"}; company size: ${size}.
Strongly prioritize companies with a CONCRETE, CURRENT demand signal for this service — e.g. they are hiring for the relevant role (a job post / "we're hiring"), publicly looking for an agency or freelancer, just raised funding to build, launching a new product, or have an obvious gap this service fixes. Rank by how clearly they need it now. Skip companies with no demand signal in favour of ones that have it. The "signal" field MUST state that specific, current need (e.g. "Hiring a React developer — job post", "Looking for an SEO agency").
IMPORTANT: return the ACTUAL end company that needs the work — NOT job boards, recruiters, staffing agencies, talent marketplaces, or aggregators. Exclude LinkedIn, Indeed, Upwork, Fiverr, Toptal, Arc, ZipRecruiter, Glassdoor, Reddit, Totaljobs and similar listing/marketplace sites. If a search result is a job board, identify the underlying hiring company instead and use that as the lead.
Results marked "(company job post)" are a company's own posting on its applicant-tracking page — the company is usually named in the title or the URL path (e.g. jobs.lever.co/<company>); a job post for the role this service covers is a strong signal (they need the skill; a contractor can help now). Results marked "(news)" are recent articles — funding, launches and expansion are good signals when the company plausibly needs this service as a result. Results marked "(opening / expansion)" mention businesses that recently opened, are opening soon or added a location — a new or growing business is a good lead for "${service}" (it needs to be found, look credible and win customers); score it on how plausibly it needs this service, and name the specific opening as the signal. Never return a business that is itself a competitor offering "${service}" (e.g. an agency hiring for that skill) unless it is clearly looking to outsource. Prefer companies located in or clearly serving ${geo}; drop ones that are plainly elsewhere. Treat the niche and company size as PREFERENCES for ranking, not hard filters: companies matching the niche rank first, but a company in the right geography with a clear demand signal for "${service}" from an adjacent sector is still a valid lead (say so in why_fit, and score it a little lower). Signals must be RECENT — roughly the last 12 months; ignore anything clearly older (e.g. a funding round from years ago). Each company may appear only once. For "website", use the domain shown in the results; if none is shown, give the official domain only if you are confident, otherwise "". Return up to ${n} companies — an empty list is only correct when no result names a real company with any plausible need.
If you can find a public company contact (a generic company email like hello@/info@, a main phone number, or a LinkedIn company URL), include it; otherwise leave it as an empty string. Do NOT invent contact details. Never include personal home addresses or private phone numbers.
Return ONLY a valid JSON array — no markdown fences, no commentary before or after. Each element exactly:
{"company":string,"website":string (bare domain),"location":string,"fit_score":number 0-100,"why_fit":string (one specific sentence about THIS company),"signal":string (the concrete trigger to contact them now),"source":string (URL of the search result the signal came from, or ""),"contact_role":string (the role to target),"email":string,"phone":string,"linkedin":string}`;

  if (searchContext) p += `\n\nWeb search results:\n${searchContext}`;
  return p;
}

const str = (v) => (typeof v === "string" ? v : "");

export async function POST(req) {
  const provider = activeProvider();
  if (!provider) return Response.json({ error: MISSING_KEY_MESSAGE }, { status: 500 });

  let body;
  try { body = await req.json(); } catch { return Response.json({ error: "Bad request." }, { status: 400 }); }
  const service = clip(body?.service, 80);
  const geo = clip(body?.geo, 80);
  const niche = clip(body?.niche, 120);
  const size = clip(body?.size, 40) || "any size";
  if (!service || !geo) return Response.json({ error: "Pick a service and a location first." }, { status: 400 });

  const owner = await isOwner();
  const maxN = owner ? 8 : 5;
  const n = Math.min(Math.max(parseInt(body?.count, 10) || 5, 1), maxN);

  // Same targeting within the cache window → same answer, free for everyone.
  const cacheKey = "leads:" + [service, geo, niche, size, n].map((s) => String(s).toLowerCase()).join("|");
  const cached = await cacheGet(cacheKey);

  // Who pays for this search: the owner (nobody), a license key (one credit), or
  // the visitor's one free trial search. Cached results cost nobody anything.
  const key = req.headers.get("x-fmc-key") || "";
  const paywall = paywallEnabled();
  let mode = owner ? "owner" : paywall ? "trial" : "daily";
  let vid = null, balance = null;
  if (!owner) {
    vid = await visitorId(req);
    if (cached) {
      return Response.json({ leads: cached, cached: true, owner, balance: key ? await getBalance(key) : null });
    }
    if (key && paywall) {
      balance = await spendCredit(key);
      if (balance === null) {
        return Response.json({ error: "This key has no credits left. Top up to keep searching.", code: "paywall", balance: 0 }, { status: 402 });
      }
      mode = "paid";
    } else {
      if (!(await verifyTurnstile(body?.turnstile, req))) {
        return Response.json({ error: "Please complete the quick human check, then try again.", code: "turnstile" }, { status: 403 });
      }
      const t = paywall ? await takeLifetime("trial", vid, LIMITS.freeSearches) : await take("search", vid, LIMITS.searchesPerDay);
      if (!t.ok) {
        return paywall
          ? Response.json({ error: "You've used your free search.", code: "paywall" }, { status: 402 })
          : Response.json({ error: `You've used today's ${LIMITS.searchesPerDay} free searches. They reset at midnight UTC.`, code: "limit" }, { status: 429 });
      }
      // Site-wide budget protects the free tier only; paying users are never blocked by it.
      if (!providerHasNativeSearch(provider)) {
        const g = await take("websearch", "global", LIMITS.webSearchesPerDay, SEARCHES_PER_RUN);
        if (!g.ok) {
          mode === "trial" ? await refundLifetime("trial", vid) : await refund("search", vid);
          return Response.json({ error: CAPACITY_MESSAGE, code: "capacity" }, { status: 503 });
        }
      }
    }
  }

  const fail = async (status, payload) => {
    // never charge for our own failure
    if (mode === "paid") await refundCredit(key);
    if (mode === "trial") await refundLifetime("trial", vid);
    if (mode === "daily") await refund("search", vid);
    return Response.json(payload, { status });
  };

  try {
    // Providers without native search (Groq) need an external search first.
    let searchContext = null;
    if (!providerHasNativeSearch(provider)) {
      if (!searchAvailable()) {
        return fail(500, { error: "This AI provider can't search the web. Add TAVILY_API_KEY (free, tavily.com) so the finder can pull real companies." });
      }
      const { results, extra } = await gatherSignals({ service, geo, niche });
      if (extra && (mode === "trial" || mode === "daily")) await take("websearch", "global", LIMITS.webSearchesPerDay + 5, extra); // small overdraft allowed
      if (!results.length) return fail(502, { error: "Web search returned nothing — broaden the niche or location." });
      searchContext = results.map((r, i) => `[${i + 1}] (${r.kind}) ${r.title}\n${r.url}\n${r.content}`).join("\n\n");
    }

    const prompt = buildPrompt({ n, service, geo, niche, size, searchContext });
    const result = await generate({ prompt, maxTokens: 3500, webSearch: providerHasNativeSearch(provider) });
    if (!result.ok) return fail(result.status, { error: result.error });
    if (result.stop === "max_tokens") return fail(502, { error: "The model ran out of room before finishing the list — try fewer leads." });
    if (result.stop === "refusal") return fail(502, { error: "The model declined this request — adjust the targeting and try again." });

    const text = result.text;
    const s = text.indexOf("["), e = text.lastIndexOf("]");
    if (s === -1 || e === -1) return fail(502, { error: "Could not read leads from the model output — try again." });

    let leads;
    try { leads = JSON.parse(text.slice(s, e + 1)); }
    catch { return fail(502, { error: "Could not read leads from the model output — try again." }); }
    if (!Array.isArray(leads)) return fail(502, { error: "Could not read leads from the model output — try again." });

    leads = leads
      .filter((l) => l && typeof l === "object" && l.company)
      .slice(0, n)
      .map((l) => ({
        company: String(l.company),
        website: str(l.website),
        location: str(l.location),
        fit_score: Math.min(Math.max(Math.round(Number(l.fit_score)) || 0, 0), 100),
        why_fit: str(l.why_fit),
        signal: str(l.signal),
        source: /^https?:\/\//.test(str(l.source)) ? str(l.source) : "",
        contact_role: str(l.contact_role),
        email: str(l.email),
        phone: str(l.phone),
        linkedin: str(l.linkedin),
      }));
    // the model occasionally lists a company twice
    const seen = new Set();
    leads = leads.filter((l) => {
      const k = (l.website || l.company).toLowerCase().replace(/^www\./, "");
      if (seen.has(k)) return false;
      seen.add(k);
      return true;
    });
    if (!leads.length) return fail(502, { error: "No usable leads this time — try a broader niche or another location.", ...(process.env.VERCEL_ENV === "preview" ? { debug: text.slice(0, 2500), ctx: (searchContext || "").slice(0, 9000) } : {}) });

    if (owner) leads = await enrichContacts(leads);

    await cacheSet(cacheKey, leads, CACHE_TTL);
    return Response.json({ leads, owner, balance, trial: mode === "trial", paywall });
  } catch (err) {
    return fail(500, { error: "Request failed: " + (err?.message || "unknown") });
  }
}
