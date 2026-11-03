// POST /api/extract { urls: [...], prompt?: "custom extraction instruction" }
// Runs the website extraction engine (lib/extract.js) on up to 10 sites.
// Metered like contact lookups: small free allowance, generous with a key.
import { extractSite, normalizeUrl } from "../../../lib/extract";
import { meter, giveBack, limitMessage } from "../../../lib/access";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req) {
  let b;
  try { b = await req.json(); } catch { return Response.json({ error: "Bad request." }, { status: 400 }); }
  const urls = [...new Set((Array.isArray(b?.urls) ? b.urls : String(b?.urls || "").split(/[\s,]+/)).map(normalizeUrl).filter(Boolean))];
  const prompt = typeof b?.prompt === "string" ? b.prompt.trim().slice(0, 600) : "";
  if (!urls.length) return Response.json({ error: "Add at least one website address." }, { status: 400 });

  const m = await meter(req, "lookup");
  if (!m.ok) return Response.json({ error: limitMessage(m, "website extractions"), code: m.who === "free" ? "paywall" : "limit" }, { status: 429 });
  const max = m.who === "free" ? 3 : 10;
  const batch = urls.slice(0, max);

  try {
    // all sites in parallel; each site already caps itself at 4 pages
    const results = await Promise.all(batch.map((u) => extractSite(u, { prompt })));
    if (results.every((r) => !r.ok)) await giveBack(m);
    return Response.json({ results, skipped: urls.length - batch.length, limit: max });
  } catch (err) {
    await giveBack(m);
    return Response.json({ error: "Extraction failed: " + (err?.message || "unknown") }, { status: 500 });
  }
}
