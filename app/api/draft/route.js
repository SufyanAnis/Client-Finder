// app/api/draft/route.js
// Server-side: drafts a personalized outreach message for one prospect, written
// in the voice of whoever is using the tool (their name / business / offer come
// from the "About you" fields, saved in their browser).

import { generate, MISSING_KEY_MESSAGE, activeProvider } from "../../../lib/llm";
import { LIMITS, take, refund, visitorId } from "../../../lib/ratelimit";
import { isOwner, LIMIT_MESSAGE, CAPACITY_MESSAGE } from "../../../lib/guard";

export const runtime = "nodejs";
export const maxDuration = 30;

const clip = (v, n) => (typeof v === "string" ? v.trim().slice(0, n) : "");

export async function POST(req) {
  if (!activeProvider()) return Response.json({ error: MISSING_KEY_MESSAGE }, { status: 500 });

  let b;
  try { b = await req.json(); } catch { return Response.json({ error: "Bad request." }, { status: 400 }); }
  const company = clip(b?.company, 120);
  const location = clip(b?.location, 120);
  const why_fit = clip(b?.why_fit, 400);
  const signal = clip(b?.signal, 300);
  const contact_role = clip(b?.contact_role, 80);
  const service = clip(b?.service, 80);
  const channel = ["Email", "LinkedIn", "WhatsApp"].includes(b?.channel) ? b.channel : "Email";
  const me = {
    name: clip(b?.sender?.name, 60),
    business: clip(b?.sender?.business, 80),
    offer: clip(b?.sender?.offer, 300),
  };
  if (!company) return Response.json({ error: "Missing company." }, { status: 400 });

  const owner = await isOwner();
  let vid = null, quota = null;
  if (!owner) {
    vid = await visitorId(req);
    quota = await take("draft", vid, LIMITS.draftsPerVisitor);
    if (!quota.ok) return Response.json({ error: LIMIT_MESSAGE("drafts", LIMITS.draftsPerVisitor), code: "limit" }, { status: 429 });
    const g = await take("llm", "global", LIMITS.llmCallsPerDay);
    if (!g.ok) {
      await refund("draft", vid);
      return Response.json({ error: CAPACITY_MESSAGE, code: "capacity" }, { status: 503 });
    }
  }

  const fmt =
    channel === "Email"
      ? "Email format: first line exactly 'Subject: ...' (under 7 words, lowercase is fine), then a blank line, then 70-120 words."
      : channel === "LinkedIn"
        ? "LinkedIn message format: 40-70 words, no subject line."
        : "WhatsApp format: 30-60 words, no subject line, and end with a short line offering to stop messaging if it's not relevant.";

  const sender = me.name || me.business
    ? `The sender is ${me.name || "the sender"}${me.business ? ` of ${me.business}` : ""}.`
    : "The sender is an independent provider (leave their name as {your name}).";
  const offer = me.offer ? `What the sender offers / proof: ${me.offer}` : `The sender offers "${service}".`;
  const signOff = me.name ? `Sign off as "${me.name}${me.business ? `, ${me.business}` : ""}".` : `Sign off as "{your name}".`;

  const prompt =
`Write a personalized ${channel} outreach message to ${company}${location ? ` (${location})` : ""}.
What we know about them: ${why_fit || "—"} Trigger to reach out: ${signal || "—"}. Target contact: ${contact_role || "the decision maker"}.
${sender} ${offer}
${fmt}
Reference the specific trigger naturally so it reads researched, not mass-sent. Do not invent facts about the sender (no made-up clients, results, prices or years of experience) beyond what is stated above. Address the recipient as {first name} (a placeholder the sender fills in). One soft call to action (a short reply or a quick call). Warm and human, zero buzzwords, no "I hope this finds you well", no exclamation hype. ${signOff} Output only the message.`;

  try {
    const result = await generate({ prompt, maxTokens: 600, webSearch: false, fast: !owner });
    if (!result.ok) {
      if (!owner) await refund("draft", vid);
      return Response.json({ error: result.error }, { status: result.status });
    }
    if (result.stop === "refusal" || !result.text) {
      if (!owner) await refund("draft", vid);
      return Response.json({ error: "The model declined to draft this one — try again." }, { status: 502 });
    }
    return Response.json({ message: result.text, remaining: quota?.remaining ?? null });
  } catch (err) {
    if (!owner) await refund("draft", vid);
    return Response.json({ error: "Request failed: " + (err?.message || "unknown") }, { status: 500 });
  }
}
