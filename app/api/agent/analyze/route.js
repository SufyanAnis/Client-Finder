// POST /api/agent/analyze { text } — classify a reply the owner pasted in (used
// when Gmail isn't connected, so replies can't be read automatically). Owner only.
import { ownerOnly, analyseReply } from "../../../../lib/agent";

export const runtime = "nodejs";

export async function POST(req) {
  if (!(await ownerOnly())) return Response.json({ error: "Owner only." }, { status: 401 });
  let b;
  try { b = await req.json(); } catch { return Response.json({ error: "Bad request." }, { status: 400 }); }
  const text = String(b?.text || "").trim().slice(0, 4000);
  if (!text) return Response.json({ error: "Paste their reply first." }, { status: 400 });
  const analysis = await analyseReply([{ fromMe: false, text, date: new Date().toISOString(), from: "", bounce: /mailer-daemon|delivery status notification|undeliverable/i.test(text) }]);
  return Response.json({ analysis });
}
