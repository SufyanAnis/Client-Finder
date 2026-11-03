// GET /api/gmail/auth — owner only (middleware). Starts Google's consent screen.
import crypto from "node:crypto";
import { authUrl, gmailAppConfigured } from "../../../../lib/gmail";

export const runtime = "nodejs";

export async function GET() {
  if (!gmailAppConfigured()) return new Response("Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in Vercel first.", { status: 503 });
  const state = crypto.randomBytes(16).toString("hex");
  return new Response(null, {
    status: 302,
    headers: {
      location: authUrl(state),
      "set-cookie": `fmc_oauth_state=${state}; Path=/api/gmail; HttpOnly; Secure; SameSite=Lax; Max-Age=600`,
    },
  });
}
