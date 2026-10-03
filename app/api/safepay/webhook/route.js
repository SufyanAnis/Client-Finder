// Safepay webhook — the authoritative "payment succeeded" signal, so a buyer who
// closes the tab before the redirect still gets their credits.
// Configure in Safepay dashboard → Developers → Endpoints: <site>/api/safepay/webhook
import { verifyWebhook } from "../../../../lib/safepay";
import { orderIdForTracker, getOrder, fulfillOrder, paymentsStorageReady } from "../../../../lib/credits";

export const runtime = "nodejs";

export async function POST(req) {
  let body;
  try { body = await req.json(); } catch { return Response.json({ ok: false }, { status: 400 }); }
  if (!verifyWebhook(body, req.headers.get("x-sfpy-signature"))) {
    return Response.json({ ok: false, error: "bad signature" }, { status: 401 });
  }
  if (!paymentsStorageReady()) return Response.json({ ok: false }, { status: 503 });

  const type = String(body.type || "");
  const data = body.data || {};
  const succeeded = type === "payment.succeeded" || (!type && data.state === "TRACKER_ENDED");
  if (!succeeded) return Response.json({ ok: true, ignored: type || data.state || "unknown" });

  const id = (data.tracker && (await orderIdForTracker(data.tracker))) || data.metadata?.order_id;
  const order = id ? await getOrder(id) : null;
  if (!order) return Response.json({ ok: true, ignored: "no matching order" });
  if (data.tracker && order.tracker !== data.tracker) return Response.json({ ok: true, ignored: "tracker mismatch" });

  await fulfillOrder(id, "webhook");
  return Response.json({ ok: true });
}
