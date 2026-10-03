// lib/access.js — daily caps for the cheap extras (drafts, contact lookups).
// Owner: unlimited. Valid license key: generous per-key caps. Everyone else:
// small per-visitor caps so the free trial can be tried end to end.
import { LIMITS, take, refund, visitorId } from "./ratelimit";
import { isOwner } from "./guard";
import { getBalance, keyId } from "./credits";
import { PAID_DAILY } from "./plans";

const FREE = { draft: () => LIMITS.draftsPerVisitor, lookup: () => LIMITS.lookupsPerVisitor };
const PAID = { draft: PAID_DAILY.drafts, lookup: PAID_DAILY.lookups };

// Returns { ok, who, bucket, id, remaining, limit } — pass it to giveBack() on failure.
export async function meter(req, kind) {
  if (await isOwner()) return { ok: true, who: "owner" };
  const key = req.headers.get("x-fmc-key") || "";
  if (key && (await getBalance(key)) !== null) {
    const bucket = `${kind}-key`, id = keyId(key);
    const q = await take(bucket, id, PAID[kind]);
    return { ...q, who: "paid", bucket, id };
  }
  const bucket = kind, id = await visitorId(req);
  const q = await take(bucket, id, FREE[kind]());
  return { ...q, who: "free", bucket, id };
}

export async function giveBack(m) {
  if (m?.bucket) await refund(m.bucket, m.id);
}

export const limitMessage = (m, what) =>
  m.who === "paid"
    ? `You've reached today's limit of ${m.limit} ${what} for this key. It resets at midnight UTC.`
    : `Free use includes ${m.limit} ${what} a day. Get a credit pack for many more.`;
