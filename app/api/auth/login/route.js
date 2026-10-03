// app/api/auth/login/route.js
// Owner sign-in. Checks credentials against AUTH_EMAIL / AUTH_PASSWORD env vars
// and sets a signed HttpOnly session cookie. Credentials live only on the
// server; nothing auth-related ships to the browser.

import crypto from "node:crypto";
import { NextResponse } from "next/server";
import { createSession, SESSION_COOKIE, SESSION_MAX_AGE } from "../../../../lib/auth";

export const runtime = "nodejs";

// Hash both sides so timingSafeEqual gets equal-length buffers.
function safeEqual(a, b) {
  const ha = crypto.createHash("sha256").update(String(a)).digest();
  const hb = crypto.createHash("sha256").update(String(b)).digest();
  return crypto.timingSafeEqual(ha, hb);
}

export async function POST(req) {
  const email = process.env.AUTH_EMAIL;
  const password = process.env.AUTH_PASSWORD;
  if (!password) {
    return NextResponse.json(
      { error: "Login isn't configured — set AUTH_EMAIL and AUTH_PASSWORD on the server." },
      { status: 500 }
    );
  }

  let body;
  try { body = await req.json(); } catch { body = {}; }

  const okEmail = email ? safeEqual((body.email || "").trim().toLowerCase(), email.trim().toLowerCase()) : true;
  const okPass = safeEqual(body.password || "", password);
  if (!okEmail || !okPass) {
    await new Promise((r) => setTimeout(r, 600)); // damp brute-force attempts
    return NextResponse.json({ error: "Wrong email or password." }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, await createSession((email || "owner").trim().toLowerCase()), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
  return res;
}
