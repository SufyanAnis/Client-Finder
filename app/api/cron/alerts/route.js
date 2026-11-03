// GET /api/cron/alerts — daily lead digest (vercel.json cron, 04:00 UTC ≈ 9am PKT).
// Vercel sends "Authorization: Bearer $CRON_SECRET"; the signed-in owner can also
// trigger it by hand (?test=1 shows what would be sent without sending).
import { collectNewLeads, markSent, sendTelegram, sendEmailDigest, telegramConfigured } from "../../../../lib/alerts";
import { isOwner } from "../../../../lib/guard";
import { take } from "../../../../lib/ratelimit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function GET(req) {
  const auth = req.headers.get("authorization") || "";
  // With CRON_SECRET set, only Vercel's cron (which sends it) gets in. Without it,
  // Vercel's cron user agent is accepted — and sending is capped at once per day,
  // so a spoofed call can never produce more than the one daily digest.
  const viaCron = process.env.CRON_SECRET
    ? auth === `Bearer ${process.env.CRON_SECRET}`
    : /vercel-cron/i.test(req.headers.get("user-agent") || "");
  const owner = await isOwner();
  if (!viaCron && !owner) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const items = await collectNewLeads();
  if (new URL(req.url).searchParams.get("test")) {
    return Response.json({ wouldSend: items.length, telegram: telegramConfigured(), sample: items.slice(0, 10).map((i) => `[${i.source}] ${i.company ? i.company + " — " : ""}${i.title}`) });
  }
  if (!items.length) return Response.json({ sent: 0, note: "No new matching leads today." });
  const once = await take("alerts-digest", "daily", 1);
  if (!once.ok) return Response.json({ sent: 0, note: "Today's digest was already sent." });

  const sentVia = [];
  const errors = [];
  if (telegramConfigured()) await sendTelegram(items).then(() => sentVia.push("telegram")).catch((e) => errors.push(e.message));
  await sendEmailDigest(items).then((ok) => ok && sentVia.push("email")).catch((e) => errors.push(e.message));
  if (sentVia.length) await markSent(items);
  return Response.json({ sent: sentVia.length ? items.length : 0, via: sentVia, errors });
}
