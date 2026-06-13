// app/api/draft/route.js
// Server-side: drafts a personalized outreach message for one prospect.

import { generate, MISSING_KEY_MESSAGE, activeProvider } from "../../../lib/llm";

export const runtime = "nodejs";
export const maxDuration = 30;

export async function POST(req) {
  if (!activeProvider()) return Response.json({ error: MISSING_KEY_MESSAGE }, { status: 500 });

  let b;
  try { b = await req.json(); } catch { return Response.json({ error: "Bad request." }, { status: 400 }); }
  const { company, location, why_fit, signal, contact_role, service, channel } = b || {};

  const fmt =
    channel === "Email"
      ? "Email format: first line exactly 'Subject: ...', then a blank line, then 90-130 words."
      : `${channel} format: 45-70 words, no subject line, no greeting fluff.`;

  const prompt =
`Write a personalized ${channel} outreach message from Swift Labs to ${company} (${location}).
What we know: ${why_fit} Trigger to reach out: ${signal}. Target contact: ${contact_role}.
We are pitching our "${service}" service. Swift Labs is a small senior studio (Sufyan, Waqar, Zaviar), tagline "digital products, engineered." Discovery sprints start at $1,500, 12-hour reply on weekdays.
${fmt}
Reference the specific trigger naturally so it reads researched, not mass-sent. One soft CTA (a short intro call). Warm and human, zero buzzwords, no "I hope this finds you well", no exclamation hype. Sign off as "Sufyan, Swift Labs". Output only the message.`;

  try {
    const result = await generate({ prompt, maxTokens: 700, webSearch: false });
    if (!result.ok) return Response.json({ error: result.error, detail: result.detail }, { status: result.status });
    if (result.stop === "refusal" || !result.text) {
      return Response.json({ error: "The model declined to draft this one — try again." }, { status: 502 });
    }
    return Response.json({ message: result.text });
  } catch (err) {
    return Response.json({ error: "Request failed: " + (err?.message || "unknown") }, { status: 500 });
  }
}
