// Safepay sends the buyer back here after paying (as a form POST or a GET,
// depending on the integration) with `tracker` and `sig`. Verify, issue the key,
// then send the buyer to the success page.
import { verifyRedirect } from "../../../../lib/safepay";
import { getOrder, fulfillOrder, paymentsStorageReady } from "../../../../lib/credits";
import { absUrl } from "../../../../lib/site";

export const runtime = "nodejs";

async function handle(req) {
  const url = new URL(req.url);
  let fields = Object.fromEntries(url.searchParams);
  if (req.method === "POST") {
    const ct = req.headers.get("content-type") || "";
    try {
      if (ct.includes("application/json")) fields = { ...fields, ...(await req.json()) };
      else fields = { ...fields, ...Object.fromEntries(await req.formData()) };
    } catch {}
  }
  const orderId = fields.order || fields.order_id;
  const back = (q) => Response.redirect(absUrl(`/pricing/success?${q}`), 303);
  if (!paymentsStorageReady() || !orderId) return back("error=missing");

  const order = await getOrder(orderId);
  if (!order) return back("error=unknown");
  if (order.status === "paid") return back(`order=${orderId}`);

  const tracker = fields.tracker || fields.token;
  if (tracker && tracker === order.tracker && verifyRedirect(tracker, fields.sig)) {
    await fulfillOrder(orderId, "redirect");
    return back(`order=${orderId}`);
  }
  // No valid signature (yet): the webhook may still confirm it — the success
  // page polls the order and shows the key as soon as it's paid.
  return back(`order=${orderId}&pending=1`);
}

export const GET = handle;
export const POST = handle;
