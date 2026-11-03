// middleware.js
// The site is public. Only the owner's contact inbox, the outreach agent and
// the Gmail connection (and their APIs) need the owner login. The credit-spending APIs are public too, but metered per
// visitor in their route handlers (lib/ratelimit) — a signed-in owner skips the
// meter there. If AUTH_PASSWORD isn't set the inbox lock is off, matching how
// every other optional feature here degrades.

import { NextResponse } from "next/server";
import { verifySession, authConfigured, SESSION_COOKIE } from "./lib/auth";

export async function middleware(req) {
  if (!authConfigured()) return NextResponse.next();

  const session = await verifySession(req.cookies.get(SESSION_COOKIE)?.value);
  if (session) return NextResponse.next();

  const { pathname, search } = req.nextUrl;
  if (pathname.startsWith("/api/")) {
    return NextResponse.json({ error: "Signed out — log in again to continue." }, { status: 401 });
  }
  const login = new URL("/login", req.url);
  login.searchParams.set("next", pathname + search);
  return NextResponse.redirect(login);
}

export const config = {
  matcher: ["/inbox/:path*", "/api/requests/:path*", "/agent/:path*", "/api/agent/:path*", "/api/gmail/:path*"],
};
