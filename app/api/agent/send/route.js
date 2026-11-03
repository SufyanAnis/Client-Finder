// POST /api/agent/send { to, subject, body, fromName?, threadId?, inReplyTo? } — owner only.
// Sends ONE approved email from the owner's Gmail. Daily cap protects the
// mailbox's reputation; addresses that said no are refused.
import { ownerOnly } from "../../../../lib/agent";
import { sendEmail } from "../../../../lib/gmail";
import { take, redis, redisConfigured } from "../../../../lib/ratelimit";

export const runtime = "nodejs";

const DAILY_CAP = Number(process.env.AGENT_DAILY_CAP || 20);

export async function POST(req) {
  if (!(await ownerOnly())) return Response.json({ error: "Owner only." }, { status: 401 });
  let b;
  try { b = await req.json(); } catch { return Response.json({ error: "Bad request." }, { status: 400 }); }
  const to = String(b?.to || "").trim().toLowerCase();
  if (!to || !b?.body) return Response.json({ error: "Missing recipient or message." }, { status: 400 });

  if (redisConfigured()) {
    const [blocked] = await redis([["SISMEMBER", "fmc:agent:suppressed", to]]).catch(() => [0]);
    if (Number(blocked)) return Response.json({ error: `${to} asked not to be contacted — not sent.` }, { status: 409 });
  }
  const isNew = !b?.threadId;
  if (isNew) {
    const q = await take("agent-send", "owner", DAILY_CAP);
    if (!q.ok) return Response.json({ error: `Daily limit of ${DAILY_CAP} new emails reached — keeps your Gmail out of spam. Resets at midnight UTC.` }, { status: 429 });
  }
  try {
    const sent = await sendEmail({ to, subject: b.subject || "", body: b.body, fromName: b.fromName || "", threadId: b.threadId || "", inReplyTo: b.inReplyTo || "" });
    return Response.json({ ok: true, ...sent, sentAt: new Date().toISOString() });
  } catch (e) {
    return Response.json({ error: e.message, code: e.code }, { status: e.code === "not_connected" ? 412 : 502 });
  }
}
