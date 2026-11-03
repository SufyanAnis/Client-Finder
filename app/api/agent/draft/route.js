// POST /api/agent/draft { type, lead, profile, thread?, skipResearch? } → { subject, body, research }
// Researches the lead (website extractor) and writes the message. Owner only.
import { ownerOnly, research, writeMessage } from "../../../../lib/agent";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req) {
  if (!(await ownerOnly())) return Response.json({ error: "Owner only." }, { status: 401 });
  let b;
  try { b = await req.json(); } catch { return Response.json({ error: "Bad request." }, { status: 400 }); }
  const lead = b?.lead || {};
  const type = ["email", "apply", "reply", "followup", "response"].includes(b?.type) ? b.type : "email";
  try {
    const r = b?.skipResearch && b?.research ? b.research : await research(lead);
    const msg = await writeMessage({ type, lead, profile: b?.profile || {}, research: r, thread: Array.isArray(b?.thread) ? b.thread : [] });
    return Response.json({ ...msg, research: r });
  } catch (e) {
    return Response.json({ error: e.message || "Draft failed" }, { status: 502 });
  }
}
