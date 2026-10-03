// app/api/lookup-contact/route.js
// On-demand public contact lookup for ONE lead (costs one web search), so
// public searches stay at one web search each. Metered for visitors.

import { activeProvider, MISSING_KEY_MESSAGE } from "../../../lib/llm";
import { searchAvailable } from "../../../lib/search";
import { enrichContacts } from "../../../lib/enrich";
import { LIMITS, take } from "../../../lib/ratelimit";
import { CAPACITY_MESSAGE } from "../../../lib/guard";
import { meter, giveBack, limitMessage } from "../../../lib/access";

export const runtime = "nodejs";
export const maxDuration = 30;

const clip = (v, n) => (typeof v === "string" ? v.trim().slice(0, n) : "");

export async function POST(req) {
  if (!activeProvider()) return Response.json({ error: MISSING_KEY_MESSAGE }, { status: 500 });
  if (!searchAvailable()) return Response.json({ error: "Contact lookup isn't available on this server." }, { status: 500 });

  let b;
  try { b = await req.json(); } catch { return Response.json({ error: "Bad request." }, { status: 400 }); }
  const lead = {
    company: clip(b?.company, 120),
    website: clip(b?.website, 120),
    location: clip(b?.location, 120),
    email: "", phone: "", linkedin: "",
  };
  if (!lead.company) return Response.json({ error: "Missing company." }, { status: 400 });

  const m = await meter(req, "lookup");
  if (!m.ok) return Response.json({ error: limitMessage(m, "contact lookups"), code: m.who === "free" ? "paywall" : "limit" }, { status: 429 });
  if (m.who === "free") {
    const g = await take("websearch", "global", LIMITS.webSearchesPerDay);
    if (!g.ok) {
      await giveBack(m);
      return Response.json({ error: CAPACITY_MESSAGE, code: "capacity" }, { status: 503 });
    }
  }

  const [found] = await enrichContacts([lead]);
  const contact = { email: found.email, phone: found.phone, linkedin: found.linkedin };
  return Response.json({ contact, found: !!(contact.email || contact.phone || contact.linkedin), remaining: m.remaining ?? null });
}
