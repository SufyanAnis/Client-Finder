// GET /api/cron/alerts — the agent's daily run (vercel.json cron, 04:00 UTC ≈ 9am PKT):
//   1. Gmail check: positive replies to answer + follow-ups due → reminder first
//   2. New leads matching ALERT_KEYWORDS → digest
// Delivered to Telegram and/or the owner's Gmail. Vercel sends
// "Authorization: Bearer $CRON_SECRET"; the signed-in owner can run it by hand
// (?test=1 returns what would be sent without sending).
import { collectNewLeads, markSent, sendTelegram, sendEmailDigest, telegramConfigured, gmailReport, formatReport, sendTelegramText } from "../../../../lib/alerts";
import { sendEmail } from "../../../../lib/gmail";
import { isOwner } from "../../../../lib/guard";
import { take } from "../../../../lib/ratelimit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function GET(req) {
  const auth = req.headers.get("authorization") || "";
  // With CRON_SECRET set, only Vercel's cron (which sends it) gets in. Without it,
  // Vercel's cron user agent is accepted — and sending is capped at once per day,
  // so a spoofed call can never produce more than the one daily run.
  const viaCron = process.env.CRON_SECRET
    ? auth === `Bearer ${process.env.CRON_SECRET}`
    : /vercel-cron/i.test(req.headers.get("user-agent") || "");
  if (!viaCron && !(await isOwner())) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const [items, report] = await Promise.all([collectNewLeads(), gmailReport()]);
  const reportText = report && (report.positives.length || report.due.length) ? formatReport(report) : "";

  if (new URL(req.url).searchParams.get("test")) {
    return Response.json({
      wouldSend: items.length, telegram: telegramConfigured(), gmailChecked: !!report,
      positives: report?.positives || [], followUpsDue: report?.due?.length || 0,
      sample: items.slice(0, 10).map((i) => `[${i.source}] ${i.company ? i.company + " — " : ""}${i.title}`),
    });
  }
  if (!items.length && !reportText) return Response.json({ sent: 0, note: "Nothing new today." });
  const once = await take("alerts-digest", "daily", 1);
  if (!once.ok) return Response.json({ sent: 0, note: "Today's run already happened." });

  const via = [], errors = [];
  // 1) reminders about replies/follow-ups — sent first and separately so they stand out
  if (reportText) {
    if (telegramConfigured()) await sendTelegramText(reportText).then(() => via.push("telegram:reminders")).catch((e) => errors.push(e.message));
    if (process.env.AGENT_GMAIL) {
      const plain = reportText.replace(/<a href="([^"]+)">[^<]*<\/a>/g, "$1").replace(/<[^>]+>/g, "");
      await sendEmail({ to: process.env.AGENT_GMAIL, subject: report.positives.length ? `🔥 ${report.positives.length} positive repl${report.positives.length === 1 ? "y" : "ies"} to answer` : `⏰ ${report.due.length} follow-ups due`, body: plain, fromName: "FindMyClients agent" })
        .then(() => via.push("email:reminders")).catch((e) => errors.push(e.message));
    }
  }
  // 2) new leads digest
  if (items.length) {
    if (telegramConfigured()) await sendTelegram(items).then(() => via.push("telegram:leads")).catch((e) => errors.push(e.message));
    await sendEmailDigest(items).then((ok) => ok && via.push("email:leads")).catch((e) => errors.push(e.message));
    if (via.some((v) => v.endsWith(":leads"))) await markSent(items);
  }
  return Response.json({ leads: items.length, positives: report?.positives?.length || 0, followUpsDue: report?.due?.length || 0, via, errors });
}
