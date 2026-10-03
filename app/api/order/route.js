// GET /api/order?id=… — the success page polls this until the order is paid,
// then shows the key. The 128-bit random order id is the capability.
import { getOrder, getBalance, paymentsStorageReady } from "../../../lib/credits";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req) {
  if (!paymentsStorageReady()) return Response.json({ error: "unavailable" }, { status: 503 });
  const id = new URL(req.url).searchParams.get("id");
  const order = await getOrder(id);
  if (!order) return Response.json({ error: "Order not found." }, { status: 404 });
  if (order.status !== "paid") return Response.json({ status: order.status, credits: order.credits });
  return Response.json({ status: "paid", key: order.key, credits: order.credits, balance: await getBalance(order.key) });
}
