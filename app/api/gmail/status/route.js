// GET /api/gmail/status — is Gmail set up and connected? (owner only)
import { gmailAppConfigured, profile } from "../../../../lib/gmail";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  if (!gmailAppConfigured()) return Response.json({ app: false, connected: false });
  try {
    const p = await profile();
    const expected = (process.env.AGENT_GMAIL || "").toLowerCase();
    return Response.json({ app: true, connected: true, email: p.emailAddress, mismatch: !!expected && p.emailAddress.toLowerCase() !== expected });
  } catch (e) {
    return Response.json({ app: true, connected: false, error: e.message });
  }
}
