// POST /api/credits { key } → { valid, balance } — check a license key.
import { getBalance, validKeyShape, paymentsStorageReady } from "../../../lib/credits";
import { take, visitorId } from "../../../lib/ratelimit";

export const runtime = "nodejs";

export async function POST(req) {
  if (!paymentsStorageReady()) return Response.json({ valid: false, error: "Payments aren't switched on yet." }, { status: 503 });
  let b;
  try { b = await req.json(); } catch { return Response.json({ valid: false }, { status: 400 }); }
  // slow down key guessing
  const q = await take("keycheck", await visitorId(req), 60);
  if (!q.ok) return Response.json({ valid: false, error: "Too many attempts today." }, { status: 429 });
  if (!validKeyShape(b?.key)) return Response.json({ valid: false, error: "That doesn't look like a FindMyClients key (FMC-XXXX-XXXX-XXXX-XXXX)." });
  const balance = await getBalance(b.key);
  if (balance === null) return Response.json({ valid: false, error: "Key not found. Check for typos, or contact us with your order details." });
  return Response.json({ valid: true, balance });
}
