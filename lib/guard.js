// lib/guard.js
// Who is calling a credit-spending API: the signed-in owner (unlimited) or a
// public visitor (metered by lib/ratelimit). Plus optional Cloudflare Turnstile
// bot protection — on only when both Turnstile keys are set.

import { cookies } from "next/headers";
import { verifySession, SESSION_COOKIE } from "./auth";

export async function isOwner() {
  const token = cookies().get(SESSION_COOKIE)?.value;
  return !!(await verifySession(token));
}

export function turnstileEnabled() {
  return !!(process.env.TURNSTILE_SECRET_KEY && process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY);
}

export async function verifyTurnstile(token, req) {
  if (!turnstileEnabled()) return true;
  if (!token) return false;
  const form = new URLSearchParams({ secret: process.env.TURNSTILE_SECRET_KEY, response: token });
  const ip = (req.headers.get("x-forwarded-for") || "").split(",")[0].trim();
  if (ip) form.set("remoteip", ip);
  try {
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", { method: "POST", body: form });
    const data = await res.json();
    return !!data.success;
  } catch {
    return false;
  }
}

export const LIMIT_MESSAGE = (what, limit) =>
  `You've used today's ${limit} free ${what}. Quotas reset at midnight UTC — come back tomorrow.`;
export const CAPACITY_MESSAGE =
  "Today's free capacity for the whole site is used up. It resets at midnight UTC — please try again tomorrow.";
