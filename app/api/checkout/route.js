// POST /api/checkout { pack } → { url } — starts a Safepay checkout for a credit pack.
import { getPack, CURRENCY } from "../../../lib/plans";
import { safepayConfigured, initOrder, checkoutUrl } from "../../../lib/safepay";
import { paymentsStorageReady, newOrderId, saveOrder } from "../../../lib/credits";
import { take, visitorId } from "../../../lib/ratelimit";
import { absUrl } from "../../../lib/site";

export const runtime = "nodejs";

export async function POST(req) {
  if (!safepayConfigured() || !paymentsStorageReady()) {
    return Response.json({ error: "Payments aren't switched on yet — please check back soon." }, { status: 503 });
  }
  let b;
  try { b = await req.json(); } catch { return Response.json({ error: "Bad request." }, { status: 400 }); }
  const pack = getPack(b?.pack);
  if (!pack) return Response.json({ error: "Unknown pack." }, { status: 400 });

  // stop anyone spamming order creation
  const q = await take("checkout", await visitorId(req), 20);
  if (!q.ok) return Response.json({ error: "Too many checkout attempts today." }, { status: 429 });

  const id = newOrderId();
  try {
    const tracker = await initOrder({ amount: pack.price, currency: CURRENCY });
    await saveOrder(id, { pack: pack.id, credits: pack.credits, amount: pack.price, currency: CURRENCY, tracker, status: "pending", created: new Date().toISOString() });
    const url = checkoutUrl({
      token: tracker,
      orderId: id,
      redirectUrl: absUrl(`/api/checkout/complete?order=${id}`),
      cancelUrl: absUrl("/pricing?cancelled=1"),
    });
    return Response.json({ url, order: id });
  } catch (e) {
    return Response.json({ error: "Couldn't start checkout — please try again in a minute." , detail: process.env.VERCEL_ENV === "production" ? undefined : e.message }, { status: 502 });
  }
}
