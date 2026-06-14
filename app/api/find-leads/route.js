// app/api/find-leads/route.js
// Server-side: holds the secret key(s) and runs the live prospecting call.
// Anthropic/Gemini search the web themselves; Groq has no native search, so we
// run a Tavily search first and feed the results to the model.

import { generate, MISSING_KEY_MESSAGE, activeProvider, providerHasNativeSearch } from "../../../lib/llm";
import { searchAvailable, webSearch } from "../../../lib/search";

export const runtime = "nodejs";
export const maxDuration = 60; // web search + generation can take a while; Hobby allows up to 60s

function buildPrompt({ n, service, geo, niche, size, searchContext }) {
  const sourceLine = searchContext
    ? `Using ONLY the web search results below, identify ${n} REAL, currently operating companies that are strong potential clients for the service: "${service}". Do NOT invent companies that don't appear in the results.`
    : `Use web search to find ${n} REAL, currently operating companies that are strong potential clients for the service: "${service}".`;

  let p =
`You are a senior B2B prospecting researcher for Swift Labs, a Karachi-based digital studio (web, mobile, AI integration, SAP/enterprise, design, SEO).
${sourceLine}
Targeting — geography: ${geo}; industry/niche: ${niche || "any relevant sector"}; company size: ${size}.
Prefer companies showing a concrete reason to reach out now (recent funding, active hiring for relevant roles, dated or slow website, expansion, a new product, weak SEO) that Swift Labs could genuinely help with.
If you can find a public contact (a generic company email like hello@/info@, a phone number, or a LinkedIn company URL), include it; otherwise leave it as an empty string. Do NOT invent contact details.
Return ONLY a valid JSON array — no markdown fences, no commentary before or after. Each element exactly:
{"company":string,"website":string (bare domain),"location":string,"fit_score":number 0-100,"why_fit":string (one specific sentence about THIS company),"signal":string (the concrete trigger to contact them now),"contact_role":string (the role to target),"email":string,"phone":string,"linkedin":string}`;

  if (searchContext) p += `\n\nWeb search results:\n${searchContext}`;
  return p;
}

export async function POST(req) {
  const provider = activeProvider();
  if (!provider) return Response.json({ error: MISSING_KEY_MESSAGE }, { status: 500 });

  let body;
  try { body = await req.json(); } catch { return Response.json({ error: "Bad request." }, { status: 400 }); }
  const { geo, niche, size, service, count } = body || {};
  const n = Math.min(Math.max(parseInt(count, 10) || 5, 1), 8);

  try {
    // Providers without native search (Groq) need an external search first.
    let searchContext = null;
    if (!providerHasNativeSearch(provider)) {
      if (!searchAvailable()) {
        return Response.json(
          { error: "This AI provider can't search the web. Add TAVILY_API_KEY (free, tavily.com) so the finder can pull real companies." },
          { status: 500 }
        );
      }
      const query = `${niche || service} companies in ${geo} (${size}) — recent funding, hiring, expansion, or new product`;
      let results;
      try {
        results = await webSearch(query, 10);
      } catch (e) {
        return Response.json({ error: "Web search failed: " + (e.message || "unknown"), detail: e.detail }, { status: 502 });
      }
      if (!results.length) return Response.json({ error: "Web search returned nothing — broaden the niche or geography." }, { status: 502 });
      searchContext = results.map((r, i) => `[${i + 1}] ${r.title}\n${r.url}\n${r.content}`).join("\n\n");
    }

    const prompt = buildPrompt({ n, service, geo, niche, size, searchContext });
    const result = await generate({ prompt, maxTokens: 4000, webSearch: providerHasNativeSearch(provider) });
    if (!result.ok) return Response.json({ error: result.error, detail: result.detail }, { status: result.status });
    if (result.stop === "max_tokens") {
      return Response.json({ error: "The model ran out of room before finishing the list — try a lower lead count." }, { status: 502 });
    }
    if (result.stop === "refusal") {
      return Response.json({ error: "The model declined this request — adjust the targeting and try again." }, { status: 502 });
    }

    const text = result.text;
    const s = text.indexOf("["), e = text.lastIndexOf("]");
    if (s === -1 || e === -1) return Response.json({ error: "Could not parse leads from the model output." }, { status: 502 });

    let leads;
    try { leads = JSON.parse(text.slice(s, e + 1)); }
    catch { return Response.json({ error: "Could not parse leads from the model output." }, { status: 502 }); }
    if (!Array.isArray(leads)) return Response.json({ error: "Could not parse leads from the model output." }, { status: 502 });

    const str = (v) => (typeof v === "string" ? v : "");
    leads = leads
      .filter((l) => l && typeof l === "object" && l.company)
      .map((l) => ({
        company: String(l.company),
        website: str(l.website),
        location: str(l.location),
        fit_score: Math.min(Math.max(Math.round(Number(l.fit_score)) || 0, 0), 100),
        why_fit: str(l.why_fit),
        signal: str(l.signal),
        contact_role: str(l.contact_role),
        email: str(l.email),
        phone: str(l.phone),
        linkedin: str(l.linkedin),
      }));
    if (!leads.length) return Response.json({ error: "No usable leads in the model output — try again." }, { status: 502 });

    leads = await enrichContacts(leads, str);

    return Response.json({ leads });
  } catch (err) {
    return Response.json({ error: "Request failed: " + (err?.message || "unknown") }, { status: 500 });
  }
}

// Best-effort: for leads missing an email or phone, search the web for public
// contact details and fill the blanks. Strictly extractive — the model is told
// to use only details that appear in the results, never to invent them. Returns
// the leads unchanged if no search provider is configured or anything fails.
async function enrichContacts(leads, str) {
  if (!searchAvailable()) return leads;
  const needing = leads.filter((l) => !l.email || !l.phone);
  if (!needing.length) return leads;

  try {
    const searched = await Promise.all(
      needing.map((l) =>
        webSearch(`${l.company} ${l.location} official contact email address phone number`, 5)
          .then((results) => ({ company: l.company, results }))
          .catch(() => ({ company: l.company, results: [] }))
      )
    );
    const ctx = searched
      .filter((s) => s.results.length)
      .map((s) => `## ${s.company}\n` + s.results.map((r) => `${r.title}\n${r.url}\n${r.content}`).join("\n---\n"))
      .join("\n\n");
    if (!ctx) return leads;

    const prompt =
`From the web search results below, extract PUBLIC contact details for each company. Use ONLY details that literally appear in the results — never guess or invent an email, phone, or LinkedIn URL. Prefer a generic company email (info@/hello@/contact@) and a main phone number (with country code if shown). If a detail isn't present, use an empty string.
Return ONLY a valid JSON array, one object per company, no markdown:
[{"company":string,"email":string,"phone":string,"linkedin":string}]

${ctx}`;

    const enr = await generate({ prompt, maxTokens: 1500, webSearch: false });
    if (!enr.ok || enr.stop !== "ok") return leads;
    const a = enr.text.indexOf("["), b = enr.text.lastIndexOf("]");
    if (a === -1 || b === -1) return leads;
    let contacts;
    try { contacts = JSON.parse(enr.text.slice(a, b + 1)); } catch { return leads; }
    if (!Array.isArray(contacts)) return leads;

    const byName = new Map(
      contacts.filter((c) => c && c.company).map((c) => [String(c.company).toLowerCase(), c])
    );
    return leads.map((l) => {
      const c = byName.get(l.company.toLowerCase());
      if (!c) return l;
      return {
        ...l,
        email: l.email || str(c.email),
        phone: l.phone || str(c.phone),
        linkedin: l.linkedin || str(c.linkedin),
      };
    });
  } catch {
    return leads; // enrichment is best-effort
  }
}
