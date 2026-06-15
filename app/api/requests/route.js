// app/api/requests/route.js
// Admin endpoint: lists inbound requests for the /inbox view. Gated by a shared
// passphrase (ADMIN_TOKEN) so client details stay private.

import { listRequests, storeAvailable } from "../../../lib/store";

export const runtime = "nodejs";

export async function GET(req) {
  const token = process.env.ADMIN_TOKEN;
  if (!token) return Response.json({ error: "Set ADMIN_TOKEN on the server to use the inbox." }, { status: 500 });
  if (req.headers.get("x-admin-token") !== token) return Response.json({ error: "Wrong passphrase." }, { status: 401 });

  if (!storeAvailable()) {
    return Response.json({ error: "Supabase isn't configured — running in email-only mode, so requests arrive in your inbox, not here." }, { status: 400 });
  }
  const result = await listRequests();
  if (!result.ok) return Response.json({ error: result.error, detail: result.detail }, { status: 502 });
  return Response.json({ requests: result.rows });
}
