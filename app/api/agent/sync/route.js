// POST /api/agent/sync { threads: [{ id, threadId, lastSeen }] } — owner only.
// For each tracked Gmail thread: new replies? classify them, flag stops
// (declined / unsubscribe / bounce) and add those addresses to the suppression list.
import { ownerOnly, analyseReply } from "../../../../lib/agent";
import { thread } from "../../../../lib/gmail";
import { redis, redisConfigured } from "../../../../lib/ratelimit";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req) {
  if (!(await ownerOnly())) return Response.json({ error: "Owner only." }, { status: 401 });
  let b;
  try { b = await req.json(); } catch { return Response.json({ error: "Bad request." }, { status: 400 }); }
  const list = (Array.isArray(b?.threads) ? b.threads : []).filter((t) => t?.threadId).slice(0, 40);
  try {
    const results = await Promise.all(list.map(async (t) => {
      try {
        const msgs = await thread(t.threadId);
        const theirs = msgs.filter((m) => !m.fromMe);
        const latest = theirs[theirs.length - 1];
        const isNew = latest && (!t.lastSeen || latest.date > t.lastSeen);
        const analysis = isNew ? await analyseReply(msgs) : null;
        if (analysis?.stop && redisConfigured()) {
          const addr = (latest.from.match(/<([^>]+)>/) || [, latest.from])[1].trim().toLowerCase();
          await redis([["SADD", "fmc:agent:suppressed", addr]]).catch(() => {});
        }
        return {
          id: t.id, threadId: t.threadId, replies: theirs.length, lastSeen: latest?.date || t.lastSeen || null,
          newReply: !!isNew, analysis, messages: msgs.map((m) => ({ fromMe: m.fromMe, date: m.date, text: m.text, messageId: m.messageId, bounce: m.bounce })),
        };
      } catch (e) {
        return { id: t.id, threadId: t.threadId, error: e.message };
      }
    }));
    return Response.json({ results });
  } catch (e) {
    return Response.json({ error: e.message }, { status: 502 });
  }
}
