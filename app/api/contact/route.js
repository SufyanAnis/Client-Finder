// app/api/contact/route.js
// Public endpoint behind the /contact form.
// Delivers to whichever destinations are configured (email + Supabase inbox).

import { saveRequest, storeAvailable } from "../../../lib/store";
import { sendRequestEmail, emailAvailable } from "../../../lib/notify";
import { take, visitorId } from "../../../lib/ratelimit";

export const runtime = "nodejs";
export const maxDuration = 20;

const clip = (v, n) => (typeof v === "string" ? v.trim().slice(0, n) : "");

export async function POST(req) {
  let b;
  try { b = await req.json(); } catch { return Response.json({ error: "Bad request." }, { status: 400 }); }

  // honeypot — bots fill hidden fields; humans don't
  if (b?.botcheck) return Response.json({ ok: true });

  const r = {
    name: clip(b?.name, 120),
    email: clip(b?.email, 160),
    company: clip(b?.company, 160),
    phone: clip(b?.phone, 60),
    service: clip(b?.service, 80),
    message: clip(b?.message, 2000),
  };
  if (!r.name || !r.email) return Response.json({ error: "Name and email are required." }, { status: 400 });
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(r.email)) return Response.json({ error: "Please enter a valid email." }, { status: 400 });

  const quota = await take("contact", await visitorId(req), 5);
  if (!quota.ok) return Response.json({ error: "Too many messages today — please try again tomorrow." }, { status: 429 });

  if (!storeAvailable() && !emailAvailable()) {
    return Response.json({ error: "The contact form isn't set up on the server yet — please try again later." }, { status: 500 });
  }

  const settled = await Promise.allSettled([
    emailAvailable() ? sendRequestEmail(r) : Promise.resolve({ ok: false, skip: true }),
    storeAvailable() ? saveRequest(r) : Promise.resolve({ ok: false, skip: true }),
  ]);
  const delivered = settled.some((x) => x.status === "fulfilled" && x.value?.ok);
  if (!delivered) return Response.json({ error: "Couldn't send your message — please try again." }, { status: 502 });

  return Response.json({ ok: true });
}
