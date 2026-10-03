// app/api/find-leads/route.js
// Server-side: holds the secret key(s) and runs the live prospecting call.
// Anthropic/Gemini search the web themselves; Groq has no native search, so we
// run a Tavily search first and feed the results to the model.
//
// Public visitors are metered (lib/ratelimit) and get up to 5 leads with no
// automatic contact enrichment — that costs one extra web search per lead, so
// it's on demand via /api/lookup-contact instead. The signed-in owner is
// unlimited and keeps automatic enrichment.

import { generate, MISSING_KEY_MESSAGE, activeProvider, providerHasNativeSearch } from "../../../lib/llm";
import { searchAvailable, webSearch } from "../../../lib/search";
import { roleFor } from "../../../lib/services";
import { LIMITS, take, refund, remaining, visitorId, cacheGet, cacheSet } from "../../../lib/ratelimit";
import { isOwner, verifyTurnstile, LIMIT_MESSAGE, CAPACITY_MESSAGE } from "../../../lib/guard";
import { enrichContacts } from "../../../lib/enrich";

export const runtime = "nodejs";
export const maxDuration = 60; // web search + generation can take a while; Hobby allows up to 60s

const CACHE_TTL = 60 * 60 * 12; // identical searches within 12h reuse the result
const clip = (v, n) => (typeof v === "string" ? v.trim().slice(0, n) : "");

// A query aimed at hiring/seeking intent, not just "good-fit companies".
function demandQuery({ service, geo, niche, size }) {
  const sector = niche ? `${niche} ` : "";
  return `${sector}companies in ${geo} hiring ${roleFor(service)} or looking for ${service} help right now (${size}) — job posts, "we're hiring", or "seeking agency/freelancer"`;
}

function buildPrompt({ n, service, geo, niche, size, searchContext }) {
  const sourceLine = searchContext
    ? `Using ONLY the web search results below, identify up to ${n} REAL companies that show an ACTIVE NEED for "${service}" right now. Do NOT invent companies that don't appear in the results.`
    : `Use web search to find ${n} REAL companies that show an ACTIVE NEED for "${service}" right now.`;

  let p =
`You are a senior B2B prospecting researcher helping an independent provider of "${service}" (a freelancer or small agency) find clients.
${sourceLine}
Targeting — geography: ${geo}; industry/niche: ${niche || "any relevant sector"}; company size: ${size}.
Strongly prioritize companies with a CONCRETE, CURRENT demand signal for this service — e.g. they are hiring for the relevant role (a job post / "we're hiring"), publicly looking for an agency or freelancer, just raised funding to build, launching a new product, or have an obvious gap this service fixes. Rank by how clearly they need it now. Skip companies with no demand signal in favour of ones that have it. The "signal" field MUST state that specific, current need (e.g. "Hiring a React developer — job post", "Looking for an SEO agency").
IMPORTANT: return the ACTUAL end company that needs the work — NOT job boards, recruiters, staffing agencies, or aggregators. Exclude LinkedIn, Indeed, Upwork, Fiverr, ZipRecruiter, Glassdoor, Reddit, Wellfound/AngelList, Totaljobs and similar listing/marketplace sites. If a search result is a job board, identify the underlying hiring company instead and use that as the lead.
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

  let vid = null;
  let quota = null;
  if (!owner) {
    vid = await visitorId(req);
    if (!cached) {
      if (!(await verifyTurnstile(body?.turnstile, req))) {
        return Response.json({ error: "Please complete the quick human check, then try again.", code: "turnstile" }, { status: 403 });
      }
      quota = await take("search", vid, LIMITS.searchesPerVisitor);
      if (!quota.ok) {
        return Response.json({ error: LIMIT_MESSAGE("searches", LIMITS.searchesPerVisitor), code: "limit", remaining: 0 }, { status: 429 });
      }
    }
  }

  if (cached) {
    const left = owner ? null : await remaining("search", vid, LIMITS.searchesPerVisitor);
    return Response.json({ leads: cached, cached: true, remaining: left, owner });
  }

  // Site-wide budget for upstream web searches (owner's runs don't count).
  if (!owner && !providerHasNativeSearch(provider)) {
    const g = await take("websearch", "global", LIMITS.webSearchesPerDay);
    if (!g.ok) {
      await refund("search", vid);
      return Response.json({ error: CAPACITY_MESSAGE, code: "capacity" }, { status: 503 });
    }
  }

  const fail = async (status, payload) => {
    if (!owner) await refund("search", vid); // don't charge a visitor for our failure
    return Response.json(payload, { status });
  };

  try {
    // Providers without native search (Groq) need an external search first.
    let searchContext = null;
    if (!providerHasNativeSearch(provider)) {
      if (!searchAvailable()) {
        return fail(500, { error: "This AI provider can't search the web. Add TAVILY_API_KEY (free, tavily.com) so the finder can pull real companies." });
      }
      let results;
      try {
        results = await webSearch(demandQuery({ service, geo, niche, size }), 10);
      } catch (e) {
        return fail(502, { error: "Web search failed: " + (e.message || "unknown") });
      }
      if (!results.length) return fail(502, { error: "Web search returned nothing — broaden the niche or location." });
      searchContext = results.map((r, i) => `[${i + 1}] ${r.title}\n${r.url}\n${r.content}`).join("\n\n");
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
    if (!leads.length) return fail(502, { error: "No usable leads this time — try a broader niche or another location." });

    if (owner) leads = await enrichContacts(leads);

    await cacheSet(cacheKey, leads, CACHE_TTL);
    return Response.json({ leads, remaining: quota?.remaining ?? null, owner });
  } catch (err) {
    return fail(500, { error: "Request failed: " + (err?.message || "unknown") });
  }
}
