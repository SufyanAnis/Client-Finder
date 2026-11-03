// lib/alerts.js — Huginn-style "watchers" without running Huginn: a daily Vercel
// cron (free) scans every lead source, keeps NEW items matching the owner's
// keywords, and sends one digest to Telegram (free bot) and/or the owner's Gmail.
//
// Env: TELEGRAM_BOT_TOKEN + TELEGRAM_CHAT_ID (from @BotFather), ALERT_KEYWORDS
// (comma-separated; defaults below), CRON_SECRET (Vercel sends it to the cron).
// "New" = not sent before (Redis set, when configured) or posted in the last ~26h.
import { getRedditBoard, getFeedsBoard, getLinkedInBoard, getTwitterBoard, safe } from "./board";
import { redis, redisConfigured } from "./ratelimit";
import { gmailAppConfigured, sendEmail } from "./gmail";
import { absUrl } from "./site";

const DEFAULT_KEYWORDS = "next.js,nextjs,react,web developer,website,web app,landing page,shopify,wordpress,mobile app,ios,android,flutter,react native,ai,automation,chatbot,ui/ux,ux,ui designer,figma,seo,full stack,frontend,front-end";

export const alertKeywords = () =>
  String(process.env.ALERT_KEYWORDS || DEFAULT_KEYWORDS).split(",").map((s) => s.trim().toLowerCase()).filter(Boolean);

const kwRegex = (kws) => new RegExp(kws.map((k) => k.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).map((k) => (/^[a-z0-9]/.test(k) ? `\\b${k}` : k)).join("|"), "i");

export async function collectNewLeads({ hours = 26 } = {}) {
  const [reddit, feeds, linkedin, x] = await Promise.all([safe(getRedditBoard), safe(getFeedsBoard), safe(getLinkedInBoard), safe(getTwitterBoard)]);
  const items = [
    ...(reddit?.cats || []).flatMap((c) => c.posts.map((p) => ({ id: "r-" + p.id, source: "Reddit", title: p.title, company: "r/" + p.subreddit, url: p.url, extra: p.budget, posted: "" }))),
    ...(x?.items || []), ...(linkedin?.items || []),
    ...(feeds?.hn || []), ...(feeds?.remote || []), ...(feeds?.launches || []),
  ];
  const re = kwRegex(alertKeywords());
  const cutoff = Date.now() - hours * 3600000;
  let matched = items.filter((i) => re.test(`${i.title} ${i.company}`)); // not the auto-category: it over-matches

  if (redisConfigured()) {
    // exact "never sent before" using a seen-set
    const flags = await redis(matched.map((i) => ["SISMEMBER", "fmc:alerts:seen", i.id])).catch(() => matched.map(() => 0));
    matched = matched.filter((_, k) => !Number(flags[k]));
  } else {
    // no storage: fall back to "posted recently" (undated items are skipped to avoid repeats)
    matched = matched.filter((i) => i.posted && Date.parse(i.posted) >= cutoff);
  }
  return matched.slice(0, 60);
}

export async function markSent(items) {
  if (!redisConfigured() || !items.length) return;
  await redis([["SADD", "fmc:alerts:seen", ...items.map((i) => i.id)], ["EXPIRE", "fmc:alerts:seen", 60 * 60 * 24 * 30]]).catch(() => {});
}

// ---- delivery --------------------------------------------------------------------
const esc = (s) => String(s || "").replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]));

export const telegramConfigured = () => !!(process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID);

export async function sendTelegram(items) {
  const bySource = items.reduce((m, i) => ((m[i.source] = m[i.source] || []).push(i), m), {});
  const chunks = [`<b>🎯 ${items.length} new lead${items.length === 1 ? "" : "s"} for you</b>`];
  for (const [src, list] of Object.entries(bySource)) {
    chunks.push(`\n<b>${esc(src)}</b>`);
    list.slice(0, 15).forEach((i) => chunks.push(`• <a href="${esc(i.url)}">${esc((i.company ? i.company + " — " : "") + i.title).slice(0, 140)}</a>${i.salary || i.extra ? " · " + esc(i.salary || i.extra) : ""}`));
  }
  chunks.push(`\nAll leads: ${absUrl("/leads")} · Agent: ${absUrl("/agent")}`);
  // Telegram messages max 4096 chars — split on line boundaries
  const msgs = [];
  let cur = "";
  for (const line of chunks) { if ((cur + "\n" + line).length > 3800) { msgs.push(cur); cur = ""; } cur += (cur ? "\n" : "") + line; }
  if (cur) msgs.push(cur);
  for (const text of msgs) {
    const res = await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ chat_id: process.env.TELEGRAM_CHAT_ID, text, parse_mode: "HTML", disable_web_page_preview: true }),
    });
    if (!res.ok) throw new Error("Telegram " + res.status + " " + (await res.text()).slice(0, 120));
  }
}

export async function sendEmailDigest(items) {
  const to = process.env.AGENT_GMAIL;
  if (!to || !gmailAppConfigured()) return false;
  const body = [
    `${items.length} new leads matching your keywords:`,
    "",
    ...items.map((i) => `• [${i.source}] ${i.company ? i.company + " — " : ""}${i.title}${i.salary || i.extra ? " (" + (i.salary || i.extra) + ")" : ""}\n  ${i.url}`),
    "",
    `All leads: ${absUrl("/leads")}`,
    `Agent: ${absUrl("/agent")}`,
  ].join("\n");
  await sendEmail({ to, subject: `${items.length} new leads — FindMyClients`, body, fromName: "FindMyClients alerts" });
  return true;
}
