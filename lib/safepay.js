// lib/safepay.js — Safepay hosted checkout (Pakistan), called over plain HTTPS.
// Mirrors the official @sfpy/node-sdk v3 flow without its dependencies:
//   1. POST {api}/order/v1/init → a tracker token ("track_…")
//   2. send the buyer to {checkout}/pay?beacon=<token>&…
//   3. Safepay returns the buyer to redirect_url with `tracker` + `sig`
//      (sig = HMAC-SHA256(tracker, v1 secret)), and separately POSTs a webhook
//      signed with HMAC-SHA512 in the X-SFPY-SIGNATURE header.
//
// Env: SAFEPAY_ENV (sandbox|production), SAFEPAY_API_KEY, SAFEPAY_SECRET_KEY (v1
// secret), SAFEPAY_WEBHOOK_SECRET. SAFEPAY_AMOUNT_MULTIPLIER converts rupees to
// the unit Safepay expects (default 1 = rupees; set 100 if checkout shows 1/100th).

import crypto from "node:crypto";

const ENV = process.env.SAFEPAY_ENV === "production" ? "production" : "sandbox";
const API = ENV === "production" ? "https://api.getsafepay.com" : "https://sandbox.api.getsafepay.com";
const CHECKOUT = ENV === "production" ? "https://getsafepay.com/checkout" : "https://sandbox.api.getsafepay.com/checkout";
const MULT = Number(process.env.SAFEPAY_AMOUNT_MULTIPLIER || 1);

export function safepayConfigured() {
  return !!(process.env.SAFEPAY_API_KEY && process.env.SAFEPAY_SECRET_KEY);
}

export const toSafepayAmount = (rupees) => rupees * MULT;

// Returns the tracker token for a new order.
export async function initOrder({ amount, currency }) {
  const res = await fetch(`${API}/order/v1/init`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ amount: toSafepayAmount(amount), client: process.env.SAFEPAY_API_KEY, currency, environment: ENV }),
    cache: "no-store",
  });
  const data = await res.json().catch(() => ({}));
  const token = data?.data?.token;
  if (!res.ok || !token) {
    throw new Error("Safepay init failed: " + (data?.status?.errors?.[0] || data?.status?.message || res.status));
  }
  return token;
}

export function checkoutUrl({ token, orderId, redirectUrl, cancelUrl }) {
  const params = new URLSearchParams({
    beacon: token,
    cancel_url: cancelUrl,
    env: ENV,
    order_id: orderId,
    redirect_url: redirectUrl,
    source: "custom",
    webhooks: "true",
  });
  return `${CHECKOUT}/pay?${params}`;
}

const safeEq = (a, b) => {
  const x = Buffer.from(String(a || "")), y = Buffer.from(String(b || ""));
  return x.length === y.length && x.length > 0 && crypto.timingSafeEqual(x, y);
};

// The redirect back from checkout carries tracker + sig.
export function verifyRedirect(tracker, sig) {
  if (!tracker || !sig || !process.env.SAFEPAY_SECRET_KEY) return false;
  const expected = crypto.createHmac("sha256", process.env.SAFEPAY_SECRET_KEY).update(tracker).digest("hex");
  return safeEq(expected, sig);
}

// Webhook signature. Safepay's docs sign the JSON payload while the official
// SDK signs JSON.stringify(body.data), so accept either.
export function verifyWebhook(body, signature) {
  const secret = process.env.SAFEPAY_WEBHOOK_SECRET;
  if (!secret || !signature || !body) return false;
  const h = (s) => crypto.createHmac("sha512", secret).update(Buffer.from(s)).digest("hex");
  return safeEq(h(JSON.stringify(body.data)), signature) || safeEq(h(JSON.stringify(body)), signature);
}
