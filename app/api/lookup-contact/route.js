// app/api/lookup-contact/route.js
// On-demand public contact lookup for ONE lead. Reads the company's own website
// first (free, via lib/extract); only if that finds nothing does it spend a web
// search. Metered for visitors.

import { activeProvider, MISSING_KEY_MESSAGE } from "../../../lib/llm";
import { searchAvailable } from "../../../lib/search";
import { enrichContacts } from "../../../lib/enrich";
import { LIMITS, take } from "../../../lib/ratelimit";
import { CAPACITY_MESSAGE } from "../../../lib/guard";
import { meter, giveBack, limitMessage } from "../../../lib/access";
import { extractSite } from "../../../lib/extract";

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

  // 1) The company's own website, read directly — free, exact, no web-search credit.
  if (lead.website) {
    const site = await extractSite(lead.website, { useAi: false }).catch(() => null);
    if (site?.ok && (site.emails.length || site.phones.length)) {
      const contact = {
        email: site.emails[0] || "",
        phone: site.phones[0] || site.whatsapp[0] || "",
        linkedin: site.socials.linkedin || "",
        facebook: site.socials.facebook || "",
        instagram: site.socials.instagram || "",
      };
      return Response.json({ contact, found: true, via: "website", remaining: m.remaining ?? null });
    }
  }

  // 2) Fall back to a web search for the company's contact details.
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
