// middleware.js
// Locks the app behind the owner login. Public: the login page, the inbound
// "Request services" form (+ its submit API, prospects must reach it), and the
// auth endpoints. Everything else — the lead finder, its credit-spending APIs,
// the inbox — needs a valid session cookie. If AUTH_PASSWORD isn't set the lock
// is off, matching how every other optional feature here degrades.

import { NextResponse } from "next/server";
import { verifySession, authConfigured, SESSION_COOKIE } from "./lib/auth";

const PUBLIC = ["/login", "/request", "/api/request", "/api/auth/login", "/api/auth/logout"];

export async function middleware(req) {
  if (!authConfigured()) return NextResponse.next();

  const { pathname, search } = req.nextUrl;
  if (PUBLIC.includes(pathname)) return NextResponse.next();

  const session = await verifySession(req.cookies.get(SESSION_COOKIE)?.value);
  if (session) return NextResponse.next();

  if (pathname.startsWith("/api/")) {
    return NextResponse.json({ error: "Signed out — log in again to continue." }, { status: 401 });
  }
  const login = new URL("/login", req.url);
  const next = pathname + search;
  if (next !== "/") login.searchParams.set("next", next);
  return NextResponse.redirect(login);
}

export const config = {
  // Skip Next internals and any file with an extension (fonts, images, favicon).
  matcher: ["/((?!_next/static|_next/image|.*\\..*).*)"],
};
