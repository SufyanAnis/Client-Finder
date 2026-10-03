// lib/credits.js — license keys, credit balances and Safepay orders, in Redis.
//
// A key looks like FMC-7KQ2-M9XD-4TPA-R2WB. Only its SHA-256 hash is stored:
//   fmc:credits:<hash>  integer balance (atomic DECR/INCR)
//   fmc:keymeta:<hash>  JSON { total, orders[], created }
//   fmc:order:<id>      JSON { pack, credits, amount, tracker, status, key?, created }
//   fmc:tracker:<tok>   order id (so the webhook can find the order)
//
// Purchases must survive restarts, so this refuses to run on the in-memory
// fallback — payments are disabled until Upstash Redis is configured.

import crypto from "node:crypto";
import { redis, redisConfigured } from "./ratelimit";

const ORDER_TTL = 60 * 60 * 24 * 90; // order records (and the key shown on the success page) kept 90 days

export const paymentsStorageReady = () => redisConfigured();

// The paywall (1 free search, then credits) only turns on once payments can
// actually be taken. Until then the site runs on free daily limits.
export const paywallEnabled = () =>
  redisConfigured() && !!(process.env.SAFEPAY_API_KEY && process.env.SAFEPAY_SECRET_KEY);

const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no 0/O/1/I
export function newKey() {
  const bytes = crypto.randomBytes(16);
  const chars = Array.from(bytes, (b) => ALPHABET[b % ALPHABET.length]).join("");
  return "FMC-" + chars.match(/.{4}/g).join("-");
}

export const normalizeKey = (k) => String(k || "").trim().toUpperCase().replace(/\s+/g, "");
export const validKeyShape = (k) => /^FMC(-[A-Z2-9]{4}){4}$/.test(normalizeKey(k));
export const keyId = (k) => hashKey(k).slice(0, 24);
const hashKey = (k) => crypto.createHash("sha256").update(normalizeKey(k)).digest("hex");

export async function getBalance(key) {
  if (!redisConfigured() || !validKeyShape(key)) return null;
  const [n] = await redis([["GET", `fmc:credits:${hashKey(key)}`]]);
  return n === null || n === undefined ? null : Number(n);
}

// Spend one credit. Returns the new balance, or null if the key is unknown/empty.
export async function spendCredit(key) {
  if (!redisConfigured() || !validKeyShape(key)) return null;
  const k = `fmc:credits:${hashKey(key)}`;
  const [exists] = await redis([["EXISTS", k]]);
  if (!exists) return null;
  const [n] = await redis([["DECR", k]]);
  if (Number(n) < 0) {
    await redis([["INCR", k]]);
    return null;
  }
  return Number(n);
}

export async function refundCredit(key) {
  if (!redisConfigured() || !validKeyShape(key)) return;
  await redis([["INCR", `fmc:credits:${hashKey(key)}`]]);
}

// ---- orders --------------------------------------------------------------------
export const newOrderId = () => "fmc_" + crypto.randomBytes(16).toString("hex");

export async function saveOrder(id, order) {
  await redis([
    ["SET", `fmc:order:${id}`, JSON.stringify(order), "EX", ORDER_TTL],
    ...(order.tracker ? [["SET", `fmc:tracker:${order.tracker}`, id, "EX", ORDER_TTL]] : []),
  ]);
}

export async function getOrder(id) {
  if (!/^fmc_[a-f0-9]{32}$/.test(String(id || ""))) return null;
  const [v] = await redis([["GET", `fmc:order:${id}`]]);
  return v ? JSON.parse(v) : null;
}

export async function orderIdForTracker(tracker) {
  const [v] = await redis([["GET", `fmc:tracker:${tracker}`]]);
  return v || null;
}

// Mark an order paid and issue its key — exactly once, however many times the
// redirect and the webhook both arrive. A short lock serializes them.
export async function fulfillOrder(id, via) {
  const lock = `fmc:lock:${id}`;
  for (let i = 0; i < 20; i++) {
    const [ok] = await redis([["SET", lock, "1", "NX", "EX", 30]]);
    if (ok) break;
    await new Promise((r) => setTimeout(r, 250));
  }
  try {
    const order = await getOrder(id);
    if (!order) return null;
    if (order.status === "paid" && order.key) return order;
    const key = newKey();
    const h = hashKey(key);
    const meta = { total: order.credits, orders: [id], created: new Date().toISOString() };
    await redis([
      ["SET", `fmc:credits:${h}`, order.credits],
      ["SET", `fmc:keymeta:${h}`, JSON.stringify(meta)],
    ]);
    const paid = { ...order, status: "paid", key, paidAt: new Date().toISOString(), via };
    await saveOrder(id, paid);
    return paid;
  } finally {
    await redis([["DEL", lock]]);
  }
}
