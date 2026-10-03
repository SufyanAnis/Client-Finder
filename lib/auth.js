// lib/auth.js
// Signed session tokens for the owner login. Uses Web Crypto (HMAC-SHA256) so the
// same code runs in Edge middleware and Node route handlers. A token is
// base64url(payload) + "." + base64url(signature), with the expiry inside the
// signed payload so it can't be tampered with.

export const SESSION_COOKIE = "sl_session";
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

const te = new TextEncoder();

function secret() {
  // AUTH_SECRET is preferred; falls back to AUTH_PASSWORD so one env var is enough.
  return process.env.AUTH_SECRET || process.env.AUTH_PASSWORD || "";
}

export function authConfigured() {
  return !!process.env.AUTH_PASSWORD;
}

function b64url(bytes) {
  let s = "";
  for (const b of bytes) s += String.fromCharCode(b);
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromB64url(str) {
  const b64 = str.replace(/-/g, "+").replace(/_/g, "/") + "=".repeat((4 - (str.length % 4)) % 4);
  const bin = atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

function hmacKey(usages) {
  return crypto.subtle.importKey("raw", te.encode(secret()), { name: "HMAC", hash: "SHA-256" }, false, usages);
}

export async function createSession(email) {
  const payload = JSON.stringify({ e: email, exp: Math.floor(Date.now() / 1000) + SESSION_MAX_AGE });
  const p = b64url(te.encode(payload));
  const sig = await crypto.subtle.sign("HMAC", await hmacKey(["sign"]), te.encode(p));
  return p + "." + b64url(new Uint8Array(sig));
}

export async function verifySession(token) {
  if (!secret() || !token) return null;
  try {
    const [p, s] = token.split(".");
    if (!p || !s) return null;
    const ok = await crypto.subtle.verify("HMAC", await hmacKey(["verify"]), fromB64url(s), te.encode(p));
    if (!ok) return null;
    const payload = JSON.parse(new TextDecoder().decode(fromB64url(p)));
    if (!payload.exp || payload.exp < Date.now() / 1000) return null;
    return payload;
  } catch {
    return null;
  }
}
