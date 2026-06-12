// app/api/find-leads/route.js
// Server-side: holds the secret API key and runs the live web-search prospecting call.

export const runtime = "nodejs";
export const maxDuration = 60; // web search + generation can take a while; Hobby allows up to 60s

const API = "https://api.anthropic.com/v1/messages";
const MODEL = process.env.ANTHROPIC_MODEL || "claude-sonnet-4-6";

export async function POST(req) {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) {
    return Response.json({ error: "Server is missing ANTHROPIC_API_KEY." }, { status: 500 });
  }

  let body;
  try { body = await req.json(); } catch { return Response.json({ error: "Bad request." }, { status: 400 }); }
  const { geo, niche, size, service, count } = body || {};
  const n = Math.min(Math.max(parseInt(count, 10) || 5, 1), 8);

  const prompt =
`You are a senior B2B prospecting researcher for Swift Labs, a Karachi-based digital studio (web, mobile, AI integration, SAP/enterprise, design, SEO).
Use web search to find ${n} REAL, currently operating companies that are strong potential clients for the service: "${service}".
Targeting — geography: ${geo}; industry/niche: ${niche || "any relevant sector"}; company size: ${size}.
Prefer companies showing a concrete reason to reach out now (recent funding, active hiring for relevant roles, dated or slow website, expansion, a new product, weak SEO) that Swift Labs could genuinely help with.
If you can find a public contact (a generic company email like hello@/info@, a phone number, or a LinkedIn company URL), include it; otherwise leave it as an empty string. Do NOT invent contact details.
Return ONLY a valid JSON array — no markdown fences, no commentary before or after. Each element exactly:
{"company":string,"website":string (bare domain),"location":string,"fit_score":number 0-100,"why_fit":string (one specific sentence about THIS company),"signal":string (the concrete trigger to contact them now),"contact_role":string (the role to target),"email":string,"phone":string,"linkedin":string}`;

  try {
    let messages = [{ role: "user", content: prompt }];
    let data;
    // the server-side web_search loop can return stop_reason "pause_turn" with an
    // incomplete turn — resume by re-sending the assistant content (bounded)
    for (let turn = 0; ; turn++) {
      const res = await fetch(API, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-api-key": key,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: MODEL,
          max_tokens: 4000,
          messages,
          tools: [{ type: "web_search_20250305", name: "web_search", max_uses: 6 }],
        }),
      });

      if (!res.ok) {
        const t = await res.text();
        return Response.json({ error: "Anthropic API error " + res.status, detail: t.slice(0, 400) }, { status: 502 });
      }

      data = await res.json();
      if (data.stop_reason === "pause_turn" && turn < 2) {
        messages = [...messages, { role: "assistant", content: data.content }];
        continue;
      }
      break;
    }

    if (data.stop_reason === "max_tokens") {
      return Response.json({ error: "The model ran out of room before finishing the list — try a lower lead count." }, { status: 502 });
    }
    if (data.stop_reason === "refusal") {
      return Response.json({ error: "The model declined this request — adjust the targeting and try again." }, { status: 502 });
    }

    const text = (data.content || [])
      .filter((b) => b.type === "text")
      .map((b) => b.text)
      .join("\n")
      .trim();

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

    return Response.json({ leads });
  } catch (err) {
    return Response.json({ error: "Request failed: " + (err?.message || "unknown") }, { status: 500 });
  }
}
