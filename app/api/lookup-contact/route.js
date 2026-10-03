// app/api/lookup-contact/route.js
// On-demand public contact lookup for ONE lead (costs one web search), so
// public searches stay at one web search each. Metered for visitors.

import { activeProvider, MISSING_KEY_MESSAGE } from "../../../lib/llm";
import { searchAvailable } from "../../../lib/search";
import { enrichContacts } from "../../../lib/enrich";
import { LIMITS, take, refund, visitorId } from "../../../lib/ratelimit";
import { isOwner, LIMIT_MESSAGE, CAPACITY_MESSAGE } from "../../../lib/guard";

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

  const owner = await isOwner();
  let vid = null, quota = null;
  if (!owner) {
    vid = await visitorId(req);
    quota = await take("lookup", vid, LIMITS.lookupsPerVisitor);
    if (!quota.ok) return Response.json({ error: LIMIT_MESSAGE("contact lookups", LIMITS.lookupsPerVisitor), code: "limit" }, { status: 429 });
    const g = await take("websearch", "global", LIMITS.webSearchesPerDay);
    if (!g.ok) {
      await refund("lookup", vid);
      return Response.json({ error: CAPACITY_MESSAGE, code: "capacity" }, { status: 503 });
    }
  }

  const [found] = await enrichContacts([lead]);
  const contact = { email: found.email, phone: found.phone, linkedin: found.linkedin };
  return Response.json({ contact, found: !!(contact.email || contact.phone || contact.linkedin), remaining: quota?.remaining ?? null });
}
