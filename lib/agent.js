// lib/agent.js — the outreach agent's brain: research a lead, write the right
// message for it, and read replies. Owner-only (used by /api/agent/*).
// The agent never sends on its own: every message is approved in /agent first.
import { generate } from "./llm";
import { extractSite } from "./extract";
import { isOwner } from "./guard";
import { authConfigured } from "./auth";

// Defence in depth on top of the middleware: agent APIs are owner-only.
export async function ownerOnly() {
  if (!authConfigured()) return process.env.VERCEL_ENV !== "production"; // previews/local without a login set up
  return isOwner();
}

const json = (text) => {
  const a = text.indexOf("{"), b = text.lastIndexOf("}");
  if (a < 0 || b <= a) return null;
  try { return JSON.parse(text.slice(a, b + 1)); } catch { return null; }
};

const profileLine = (p = {}) =>
  [
    p.name && `Sender: ${p.name}${p.business ? ` (${p.business})` : ""}.`,
    p.services && `Services: ${p.services}.`,
    p.offer && `Offer/proof: ${p.offer}.`,
    p.portfolio && `Portfolio: ${p.portfolio}.`,
    p.calendar && `Booking link: ${p.calendar}.`,
  ].filter(Boolean).join(" ");

// Job boards' own addresses are never the application email.
const BOARD_EMAIL = /@(linkedin|remoteok|weworkremotely|remotive|jobicy|himalayas|arbeitnow|ycombinator|reddit|x|twitter|google|indeed|glassdoor)\.|^(no-?reply|noreply|privacy|legal|abuse|support|help|press|dmca)@/i;

// Job posts often say "send your CV to jobs@company.com" — find that address.
const EMAIL_RE = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/gi;
async function applicationEmail(lead) {
  if (!lead.url) return "";
  let text = `${lead.detail || ""} ${lead.title || ""}`;
  const hn = lead.url.match(/news\.ycombinator\.com\/item\?id=(\d+)/);
  if (hn) {
    // HN's own pages can refuse cloud servers; its official Algolia API has the full text
    const j = await fetch(`https://hn.algolia.com/api/v1/items/${hn[1]}`, { cache: "no-store" }).then((r) => r.json()).catch(() => ({}));
    text += " " + String(j.text || "").replace(/&#x40;|&#64;/g, "@").replace(/&#x2F;/g, "/").replace(/<[^>]+>/g, " ");
  }
  // "name [at] company [dot] com" style obfuscation
  text = text.replace(/\s*[[(]\s*at\s*[\])]\s*/gi, "@").replace(/\s*[[(]\s*dot\s*[\])]\s*/gi, ".");
  const page = hn ? null : await extractSite(lead.url, { useAi: false }).catch(() => null);
  const all = [...(text.match(EMAIL_RE) || []), ...(page?.ok ? page.emails : [])].map((e) => e.toLowerCase().replace(/\.$/, ""));
  return all.find((e) => !BOARD_EMAIL.test(e)) || "";
}

// Last line of defence against invented experience: when the owner gave no
// proof, drop any sentence that claims past projects, clients or results.
const CLAIM = /\b(my|our) (recent|past|previous|latest) (work|project|projects|clients?)\b|\bfor (my |our )?(past |previous )?clients\b|\b(i|we)('ve| have) (built|delivered|helped|worked|created|launched|shipped|developed|designed)\b|\b(i|we) (built|delivered|helped|created|launched|shipped|developed|designed) (a|an|several|many|multiple|dozens|\d+)\b|\bportfolio includes\b|\bcase stud(y|ies)\b|\btrack record\b/i;
export function stripUnbackedClaims(body, profile = {}) {
  if (String(profile.offer || "").trim()) return body;
  return body
    .split(/\n/)
    // a dot followed by a letter ("Next.js", "e.g.") is not a sentence end
    .map((para) => (para.match(/(?:[^.!?]|[.!?](?=\w))+[.!?]*\s*/g) || [para]).filter((sent) => !CLAIM.test(sent)).join("").trim())
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

// Visit the lead's website (if any) for contacts + context.
export async function research(lead) {
  const applyEmail = lead.url && !lead.email ? await applicationEmail(lead) : "";
  const site = lead.website ? await extractSite(lead.website).catch(() => null) : null;
  if (!site?.ok) return { emails: [lead.email, applyEmail].filter(Boolean), applyEmail, phones: [], signals: [], whatTheyDo: "", team: [], name: lead.company };
  return {
    applyEmail,
    emails: [...new Set([lead.email, applyEmail, ...site.emails].filter(Boolean))],
    phones: site.phones,
    signals: site.signals,
    whatTheyDo: site.ai?.what_they_do || "",
    services: site.ai?.services || [],
    team: site.ai?.team || [],
    name: site.name || lead.company,
    socials: site.socials,
  };
}

const RULES = `Rules: warm, specific, human; no buzzwords; no "I hope this finds you well"; no exclamation hype.
STRICT honesty: past work, clients, results, prices and experience may ONLY come from the sender's "Offer/proof" text — never say "we've helped…", "for past clients…" or similar unless it is written there. Never claim to have seen a post, article, launch or news item unless it appears in the lead facts. Only reference facts about the recipient that are given.
If the lead clearly needs something the sender does NOT offer (compare with "Services"), do not pitch: return {"subject": "", "body": "SKIP: <one-line reason>"}.`;

// type: "email" (first cold email) | "apply" (cover note for a job post) |
//       "reply" (Reddit/X reply) | "followup" (no answer yet) | "response" (answer their reply)
export async function writeMessage({ type, lead, profile, research: r = {}, thread = [] }) {
  const who = r.team?.[0] ? `${r.team[0].name}${r.team[0].role ? ` (${r.team[0].role})` : ""}` : "";
  const facts = [
    `Lead: ${lead.company || r.name || ""}${lead.location ? `, ${lead.location}` : ""}.`,
    lead.title && `Post/role: ${lead.title}.`,
    lead.signal && `Why now: ${lead.signal}.`,
    lead.why_fit && `Context: ${lead.why_fit}.`,
    r.whatTheyDo && `What they do: ${r.whatTheyDo}.`,
    r.signals?.length && `Website issues seen: ${r.signals.join("; ")}.`,
    who && `Named person on their site: ${who}.`,
  ].filter(Boolean).join(" ");
  const sender = profileLine(profile);
  const sign = profile?.signature || profile?.name || "{your name}";
  const history = thread.map((m) => `${m.fromMe ? "ME" : "THEM"} (${m.date.slice(0, 10)}): ${m.text.slice(0, 1200)}`).join("\n\n");

  const tasks = {
    email: `Write a first cold email. Subject: 2-6 words, lowercase ok. Body 60-110 words: open with the specific trigger, one sentence on how the sender helps with THAT, one low-commitment question. ${who ? `Address ${r.team[0].name.split(" ")[0]} by first name.` : "Greet with 'Hi there' or the company team."} End with a separate short line: "If this isn't relevant, just reply 'no' and I won't follow up." Sign off as "${sign}".`,
    apply: `Write a short application email for this job/contract post (80-140 words): why the sender fits this exact role, 1-2 relevant proof points ONLY from the sender details, availability for contract/freelance work, ${profile?.hasCv ? "mention the CV is attached, " : ""}and a polite close. Subject line: "Application: <role title>". Sign off as "${sign}".`,
    reply: `Write a public reply to their hiring post on ${lead.source || "social media"}: 30-60 words, casual and specific, mention you can share relevant examples, no links unless a portfolio link is given, one question. Subject: "" (empty).`,
    followup: `Write follow-up #${(thread.filter((m) => m.fromMe).length)} to an unanswered cold email (30-60 words): add one new useful angle or a quick idea, no guilt-tripping, easy yes/no question. Keep it in the same thread (subject: "" empty). Sign off as "${sign}".`,
    response: `Write the next reply in this conversation, answering exactly what THEY asked or said, moving toward a short call or a clear next step. 40-120 words. If they declined or asked to stop, write a one-line polite acknowledgement only. Subject: "" (empty). Sign off as "${sign}".`,
  };

  const prompt = `You write outreach for a freelancer/small agency. ${RULES}
${sender ? sender : "Sender details: not provided — keep claims generic."}
${facts}
${history ? `Conversation so far:\n${history}\n` : ""}Task: ${tasks[type] || tasks.email}
Return ONLY JSON: {"subject": string, "body": string}`;

  const res = await generate({ prompt, maxTokens: 900 });
  if (!res.ok) throw new Error(res.error || "AI unavailable");
  const out = json(res.text);
  if (!out?.body) throw new Error("Couldn't write the message — try again.");
  const body = stripUnbackedClaims(String(out.body).trim(), profile);
  if (/^SKIP:/i.test(body)) return { skip: body.replace(/^SKIP:\s*/i, "").slice(0, 200), subject: "", body: "" };
  return { subject: String(out.subject || "").slice(0, 140), body: body.slice(0, 4000) };
}

// Classify the latest reply from the lead.
export async function analyseReply(thread) {
  const last = [...thread].reverse().find((m) => !m.fromMe);
  if (!last) return null;
  if (last.bounce) return { category: "bounced", summary: "The email bounced — the address doesn't work.", stop: true };
  const res = await generate({
    prompt: `Classify this reply to a cold outreach email and summarise it in one sentence.
Categories: interested (wants to talk/learn more), question (asks something before deciding), not_now (maybe later / timing), not_interested (declined), unsubscribe (asks to stop / remove), auto_reply (out of office / automated), referral (points to someone else).
Reply:
"""${last.text.slice(0, 3000)}"""
Return ONLY JSON: {"category": string, "summary": string}`,
    maxTokens: 300,
    fast: true,
  });
  const out = (res.ok && json(res.text)) || { category: "question", summary: last.text.slice(0, 140) };
  out.stop = ["not_interested", "unsubscribe"].includes(out.category);
  return out;
}
