// lib/ratelimit.js
// Daily quotas + a small result cache, so a public free tool can't burn through
// the free Groq/Tavily tiers in an afternoon.
//
// Storage: Upstash Redis over its REST API when UPSTASH_REDIS_REST_URL/TOKEN (or
// the Vercel-marketplace KV_REST_API_URL/TOKEN) are set — free tier, shared by
// every serverless instance. Without it, an in-memory Map is used: fine locally,
// but on Vercel each instance counts separately, so limits become approximate.
//
// Windows are UTC calendar days; counters expire after two days.

const REDIS_URL = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL || "";
const REDIS_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN || "";
const DAY_TTL = 60 * 60 * 48;

const num = (v, d) => (Number.isFinite(parseInt(v, 10)) ? parseInt(v, 10) : d);

// Tunable from env without a code change.
export const LIMITS = {
  searchesPerVisitor: num(process.env.FREE_SEARCHES_PER_DAY, 3),
  draftsPerVisitor: num(process.env.FREE_DRAFTS_PER_DAY, 10),
  lookupsPerVisitor: num(process.env.FREE_LOOKUPS_PER_DAY, 5),
  // Site-wide cap on paid-ish upstream work per day (Tavily searches). Tavily's
  // free plan is ~1,000 searches/month, i.e. ~33/day.
  webSearchesPerDay: num(process.env.GLOBAL_WEB_SEARCHES_PER_DAY, 30),
  // Site-wide cap on LLM calls per day (Groq free tier is token-capped per day).
  llmCallsPerDay: num(process.env.GLOBAL_LLM_CALLS_PER_DAY, 200),
};

export function redisConfigured() {
  return !!(REDIS_URL && REDIS_TOKEN);
}

async function redis(commands) {
  const res = await fetch(`${REDIS_URL}/pipeline`, {
    method: "POST",
    headers: { Authorization: `Bearer ${REDIS_TOKEN}`, "content-type": "application/json" },
    body: JSON.stringify(commands),
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Redis error " + res.status);
  const out = await res.json();
  return out.map((r) => r.result);
}

// ---- in-memory fallback ------------------------------------------------------
const mem = globalThis.__fmcMem || (globalThis.__fmcMem = new Map());
function memGet(key) {
  const hit = mem.get(key);
  if (!hit) return null;
  if (hit.exp < Date.now()) { mem.delete(key); return null; }
  return hit.val;
}
function memSet(key, val, ttlSec) {
  mem.set(key, { val, exp: Date.now() + ttlSec * 1000 });
  if (mem.size > 5000) { // crude bound
    for (const [k, v] of mem) if (v.exp < Date.now()) mem.delete(k);
  }
}
function memIncr(key, by, ttlSec) {
  const cur = Number(memGet(key) || 0) + by;
  const hit = mem.get(key);
  mem.set(key, { val: cur, exp: hit && hit.exp > Date.now() ? hit.exp : Date.now() + ttlSec * 1000 });
  return cur;
}

// ---- counters ----------------------------------------------------------------
const today = () => new Date().toISOString().slice(0, 10);
const key = (bucket, id) => `fmc:${bucket}:${today()}:${id}`;

async function incr(k, by = 1) {
  if (!redisConfigured()) return memIncr(k, by, DAY_TTL);
  try {
    const [n] = await redis([["INCRBY", k, by], ["EXPIRE", k, DAY_TTL]]);
    return Number(n);
  } catch {
    return memIncr(k, by, DAY_TTL); // never take the site down because Redis blinked
  }
}

async function read(k) {
  if (!redisConfigured()) return Number(memGet(k) || 0);
  try {
    const [n] = await redis([["GET", k]]);
    return Number(n || 0);
  } catch {
    return Number(memGet(k) || 0);
  }
}

// Take one unit from a daily quota. Returns { ok, used, limit, remaining }.
// A rejected take is rolled back so it doesn't count.
export async function take(bucket, id, limit) {
  const k = key(bucket, id);
  const used = await incr(k, 1);
  if (used > limit) {
    await incr(k, -1);
    return { ok: false, used: limit, limit, remaining: 0 };
  }
  return { ok: true, used, limit, remaining: Math.max(limit - used, 0) };
}

// Give back a unit taken for work that then failed upstream.
export async function refund(bucket, id) {
  const k = key(bucket, id);
  const n = await incr(k, -1);
  if (n < 0) await incr(k, -n);
}

export async function remaining(bucket, id, limit) {
  const used = await read(key(bucket, id));
  return Math.max(limit - used, 0);
}

// ---- cache -------------------------------------------------------------------
export async function cacheGet(k) {
  const full = "fmc:cache:" + k;
  if (!redisConfigured()) return memGet(full);
  try {
    const [v] = await redis([["GET", full]]);
    return v ? JSON.parse(v) : null;
  } catch {
    return memGet(full);
  }
}

export async function cacheSet(k, value, ttlSec) {
  const full = "fmc:cache:" + k;
  if (!redisConfigured()) return memSet(full, value, ttlSec);
  try {
    await redis([["SET", full, JSON.stringify(value), "EX", ttlSec]]);
  } catch {
    memSet(full, value, ttlSec);
  }
}

// ---- visitor identity ----------------------------------------------------------
// A salted hash of the client IP: enough to meter usage, and the raw IP is never
// stored. Vercel sets x-forwarded-for / x-real-ip.
export async function visitorId(req) {
  const fwd = req.headers.get("x-forwarded-for") || "";
  const ip = fwd.split(",")[0].trim() || req.headers.get("x-real-ip") || "local";
  const salt = process.env.AUTH_SECRET || process.env.AUTH_PASSWORD || "fmc";
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(salt + "|" + ip));
  return Array.from(new Uint8Array(buf).slice(0, 12), (b) => b.toString(16).padStart(2, "0")).join("");
}
