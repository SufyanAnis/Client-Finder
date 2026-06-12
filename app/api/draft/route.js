// app/api/draft/route.js
// Server-side: drafts a personalized outreach message for one prospect.

export const runtime = "nodejs";
export const maxDuration = 30;

const API = "https://api.anthropic.com/v1/messages";
const MODEL = process.env.ANTHROPIC_MODEL || "claude-sonnet-4-6";

export async function POST(req) {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) return Response.json({ error: "Server is missing ANTHROPIC_API_KEY." }, { status: 500 });

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
    const res = await fetch(API, {
      method: "POST",
      headers: { "content-type": "application/json", "x-api-key": key, "anthropic-version": "2023-06-01" },
      body: JSON.stringify({ model: MODEL, max_tokens: 700, messages: [{ role: "user", content: prompt }] }),
    });
    if (!res.ok) {
      const t = await res.text();
      return Response.json({ error: "Anthropic API error " + res.status, detail: t.slice(0, 400) }, { status: 502 });
    }
    const data = await res.json();
    const message = (data.content || []).filter((x) => x.type === "text").map((x) => x.text).join("\n").trim();
    return Response.json({ message });
  } catch (err) {
    return Response.json({ error: "Request failed: " + (err?.message || "unknown") }, { status: 500 });
  }
}
