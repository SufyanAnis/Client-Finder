// app/api/auth/logout/route.js
// Clears the session cookie. Plain-form POST friendly: replies 303 so the
// browser navigates to the login page.

import { NextResponse } from "next/server";
import { SESSION_COOKIE } from "../../../../lib/auth";

export const runtime = "nodejs";

export async function POST(req) {
  const res = NextResponse.redirect(new URL("/login", req.url), 303);
  res.cookies.set(SESSION_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
  return res;
}
