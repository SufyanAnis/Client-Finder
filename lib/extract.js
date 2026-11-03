// lib/extract.js — the website extraction engine (FindMyClients' own version of the
// "SmartScraper" idea ScrapeCraft rents from ScrapeGraphAI):
//   1. fetch the homepage + up to 3 linked contact/about/team pages (same site)
//   2. pull contacts DETERMINISTICALLY (mailto/tel links, regex, schema.org JSON-LD,
//      social profile links) — these can't be hallucinated
//   3. measure website-quality signals (copyright year, mobile viewport, HTTPS, form…)
//   4. one cheap AI call over the cleaned text for what needs understanding: what
//      the business does, services, location, team names — or any custom prompt.
// SSRF-guarded: only public http(s) hosts, checked again on every redirect.

import dns from "node:dns/promises";
import net from "node:net";
import { generate } from "./llm";

const UA = "Mozilla/5.0 (compatible; FindMyClientsBot/1.0; +https://findmyclients.vercel.app/about)";
const MAX_BYTES = 1_500_000;
const PAGE_TIMEOUT = 9000;

// ---- safety ----------------------------------------------------------------------
function privateIp(ip) {
  if (net.isIPv4(ip)) {
    const [a, b] = ip.split(".").map(Number);
    return a === 10 || a === 127 || a === 0 || (a === 169 && b === 254) || (a === 172 && b >= 16 && b <= 31) ||
      (a === 192 && b === 168) || (a === 100 && b >= 64 && b <= 127) || a >= 224;
  }
  const v = ip.toLowerCase();
  return v === "::1" || v === "::" || v.startsWith("fc") || v.startsWith("fd") || v.startsWith("fe80") || v.startsWith("::ffff:") && privateIp(v.slice(7));
}

async function assertPublicUrl(u) {
  let url;
  try { url = new URL(u); } catch { throw new Error("Not a valid URL"); }
  if (!/^https?:$/.test(url.protocol)) throw new Error("Only http(s) links are allowed");
  const host = url.hostname.replace(/^\[|\]$/g, "");
  if (/^(localhost|.*\.local|.*\.internal|.*\.localdomain)$/i.test(host)) throw new Error("That address isn't allowed");
  const addrs = net.isIP(host) ? [{ address: host }] : await dns.lookup(host, { all: true }).catch(() => []);
  if (!addrs.length) throw new Error("Couldn't find that website");
  if (addrs.some((a) => privateIp(a.address))) throw new Error("That address isn't allowed");
  return url;
}

export function normalizeUrl(raw) {
  let s = String(raw || "").trim();
  if (!s) return null;
  if (!/^https?:\/\//i.test(s)) s = "https://" + s;
  try { const u = new URL(s); u.hash = ""; return u.toString(); } catch { return null; }
}

// Fetch with manual redirects so every hop is re-checked.
async function fetchPage(u) {
  let url = await assertPublicUrl(u);
  for (let hop = 0; hop < 4; hop++) {
    const res = await fetch(url, {
      redirect: "manual",
      headers: { "user-agent": UA, accept: "text/html,application/xhtml+xml" },
      signal: AbortSignal.timeout(PAGE_TIMEOUT),
      cache: "no-store",
    });
    if (res.status >= 300 && res.status < 400 && res.headers.get("location")) {
      url = await assertPublicUrl(new URL(res.headers.get("location"), url).toString());
      continue;
    }
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    if (!/html|text/i.test(res.headers.get("content-type") || "")) throw new Error("Not a web page");
    const buf = await res.arrayBuffer();
    return { url: url.toString(), html: new TextDecoder("utf-8").decode(buf.slice(0, MAX_BYTES)) };
  }
  throw new Error("Too many redirects");
}

// ---- parsing helpers -----------------------------------------------------------
const decode = (s) => s.replace(/&amp;/g, "&").replace(/&#64;|&commat;/g, "@").replace(/&#46;/g, ".").replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'").replace(/&nbsp;/g, " ").replace(/&lt;/g, "<").replace(/&gt;/g, ">");

export function htmlToText(html) {
  return decode(
    html
      .replace(/<(script|style|noscript|svg|iframe)[\s\S]*?<\/\1>/gi, " ")
      .replace(/<!--[\s\S]*?-->/g, " ")
      .replace(/<(br|\/p|\/div|\/li|\/h[1-6]|\/tr)[^>]*>/gi, "\n")
      .replace(/<[^>]+>/g, " ")
  ).replace(/[ \t]+/g, " ").replace(/\n\s*\n+/g, "\n").trim();
}

const hrefs = (html) => [...html.matchAll(/href\s*=\s*["']([^"']+)["']/gi)].map((m) => decode(m[1]).trim());

const EMAIL_RE = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,24}/gi;
const BAD_EMAIL = /\.(png|jpe?g|gif|webp|svg|css|js)$|@(example|domain|email|sentry|wixpress|sentry-next)\.|^(name|your|user|email|you)@|u003e/i;

function socials(links) {
  const pick = (re) => [...new Set(links.filter((l) => re.test(l)).map((l) => l.split("?")[0].replace(/\/$/, "")))];
  const notShare = (l) => !/sharer|share\?|intent\/|\/share|plugins|dialog|\/p\/|\/reel\/|\/status\//i.test(l);
  return {
    facebook: pick(/facebook\.com\/(?!tr\b)/i).filter(notShare)[0] || "",
    instagram: pick(/instagram\.com\//i).filter(notShare)[0] || "",
    linkedin: pick(/linkedin\.com\/(company|in)\//i)[0] || "",
    x: pick(/(twitter|x)\.com\/(?!intent|share)[A-Za-z0-9_]+$/i)[0] || "",
    tiktok: pick(/tiktok\.com\/@/i)[0] || "",
    youtube: pick(/youtube\.com\/(@|channel|c\/|user)/i)[0] || "",
  };
}

function jsonLd(html) {
  const out = [];
  for (const m of html.matchAll(/<script[^>]+application\/ld\+json[^>]*>([\s\S]*?)<\/script>/gi)) {
    try {
      const j = JSON.parse(m[1].trim());
      const flat = (x) => (Array.isArray(x) ? x.flatMap(flat) : x && x["@graph"] ? flat(x["@graph"]) : [x]);
      out.push(...flat(j).filter(Boolean));
    } catch {}
  }
  return out;
}

const normPhone = (p) => p.replace(/[^\d+]/g, "").replace(/^00/, "+");

// Deterministic contact extraction across all fetched pages.
function contactsFrom(pages) {
  const emails = new Set(), phones = new Set(), whatsapp = new Set();
  let ld = {};
  const allLinks = [];
  for (const { html, text } of pages) {
    const links = hrefs(html);
    allLinks.push(...links);
    links.filter((l) => /^mailto:/i.test(l)).forEach((l) => emails.add(l.slice(7).split("?")[0].toLowerCase()));
    links.filter((l) => /^tel:/i.test(l)).forEach((l) => phones.add(normPhone(decodeURIComponent(l.slice(4)))));
    links.filter((l) => /wa\.me\/|api\.whatsapp\.com\/send/i.test(l)).forEach((l) => {
      const n = (l.match(/wa\.me\/(\d+)/) || l.match(/phone=(\d+)/) || [])[1];
      if (n) whatsapp.add("+" + n);
    });
    (decode(html).match(EMAIL_RE) || []).forEach((e) => emails.add(e.toLowerCase()));
    // phones written in the text: only clear international numbers ("+92 300 1234567"),
    // 10–15 digits — tel: links and JSON-LD above are the reliable sources.
    (text.match(/\+\d{1,3}[\s().-]{0,2}\d[\d\s().-]{6,16}\d/g) || [])
      .map(normPhone)
      .filter((p) => { const d = p.replace(/\D/g, ""); return d.length >= 10 && d.length <= 15; })
      .forEach((p) => phones.add(p));
    for (const o of jsonLd(html)) {
      const t = [].concat(o["@type"] || []).join(" ");
      if (/Organization|LocalBusiness|Store|Restaurant|Dentist|Clinic|Service|Corporation|Place/i.test(t)) {
        ld = {
          name: ld.name || o.name || "",
          telephone: ld.telephone || o.telephone || "",
          email: ld.email || (o.email || "").replace(/^mailto:/i, ""),
          address: ld.address || (typeof o.address === "string" ? o.address : [o.address?.streetAddress, o.address?.addressLocality, o.address?.addressCountry].filter(Boolean).join(", ")),
          sameAs: [...(ld.sameAs || []), ...[].concat(o.sameAs || [])],
        };
      }
    }
  }
  if (ld.telephone) phones.add(normPhone(ld.telephone));
  if (ld.email) emails.add(ld.email.toLowerCase());
  allLinks.push(...(ld.sameAs || []));
  return {
    emails: [...emails].filter((e) => !BAD_EMAIL.test(e)).slice(0, 6),
    phones: [...phones].filter((p) => p.replace(/\D/g, "").length >= 8 && p.replace(/\D/g, "").length <= 15).slice(0, 4),
    whatsapp: [...whatsapp].slice(0, 2),
    socials: socials(allLinks),
    ldName: ld.name || "",
    ldAddress: ld.address || "",
  };
}

// Signals a web developer/designer can pitch on.
function siteSignals(home, finalUrl, pages) {
  const html = home.html;
  const year = new Date().getFullYear();
  const signals = [];
  if (!finalUrl.startsWith("https://")) signals.push("No HTTPS — browsers show 'Not secure'");
  if (!/<meta[^>]+name=["']viewport["']/i.test(html)) signals.push("Not mobile-friendly (no viewport meta tag)");
  const cr = [...html.matchAll(/(?:©|&copy;|copyright)\s*(?:\d{4}\s*[-–]\s*)?(\d{4})/gi)].map((m) => Number(m[1])).filter((y) => y > 1995 && y <= year);
  const latest = cr.length ? Math.max(...cr) : null;
  if (latest && latest <= year - 2) signals.push(`Copyright year ${latest} — site looks unmaintained`);
  if (!/<meta[^>]+name=["']description["']/i.test(html)) signals.push("No meta description (weak SEO)");
  if (!pages.some((p) => /<form[\s\S]*?(type=["']email|name=["'](email|message))/i.test(p.html))) signals.push("No contact form found");
  const gen = (html.match(/<meta[^>]+name=["']generator["'][^>]+content=["']([^"']+)/i) || [])[1];
  if (gen) signals.push(`Built with ${gen.slice(0, 40)}`);
  if (/wix\.com|wixstatic/i.test(html) && !gen) signals.push("Built on Wix");
  return signals;
}

// Links on the homepage that probably hold contact details.
function contactPageLinks(home, base) {
  const host = new URL(base).hostname.replace(/^www\./, "");
  const scored = [];
  for (const l of hrefs(home.html)) {
    if (/^(mailto|tel|javascript|#)/i.test(l)) continue;
    let u;
    try { u = new URL(l, base); } catch { continue; }
    if (u.hostname.replace(/^www\./, "") !== host) continue;
    const p = u.pathname.toLowerCase();
    const score = /contact/.test(p) ? 3 : /about|team|people|staff|who-we-are/.test(p) ? 2 : /impressum|imprint|support/.test(p) ? 1 : 0;
    if (score) { u.hash = ""; scored.push([score, u.toString()]); }
  }
  return [...new Map(scored.sort((a, b) => b[0] - a[0]).map(([, u]) => [u, u])).keys()].slice(0, 3);
}

// ---- main ------------------------------------------------------------------------
export const LEAD_PROMPT =
  "Extract: company_name, what_they_do (one sentence), services (array, max 6), location (city/country if stated), team (array of {name, role} for owners/founders/managers named on the site, max 5), target_customers (one short phrase).";

export async function extractSite(rawUrl, { prompt = "", useAi = true } = {}) {
  const start = normalizeUrl(rawUrl);
  if (!start) return { url: rawUrl, ok: false, error: "Not a valid URL" };
  let home;
  try { home = await fetchPage(start); } catch (e) { return { url: start, ok: false, error: e.message }; }
  home.text = htmlToText(home.html);

  const extra = await Promise.all(
    contactPageLinks(home, home.url).map((u) => fetchPage(u).then((p) => ({ ...p, text: htmlToText(p.html) })).catch(() => null))
  );
  const pages = [home, ...extra.filter(Boolean)];
  const c = contactsFrom(pages);
  const title = decode((home.html.match(/<title[^>]*>([\s\S]*?)<\/title>/i) || [])[1] || "").replace(/\s+/g, " ").trim();

  const result = {
    url: home.url,
    ok: true,
    pagesRead: pages.map((p) => p.url),
    name: c.ldName || title.split(/\s[|\-–—]\s/)[0].slice(0, 80),
    emails: c.emails,
    phones: c.phones,
    whatsapp: c.whatsapp,
    socials: c.socials,
    address: c.ldAddress,
    signals: siteSignals(home, home.url, pages),
    ai: null,
  };

  if (useAi) {
    const corpus = pages.map((p) => `### ${p.url}\n${p.text.slice(0, 5000)}`).join("\n\n").slice(0, 12000);
    const ask = prompt.trim() || LEAD_PROMPT;
    const r = await generate({
      prompt: `You extract information from a company's website text. Use ONLY facts that appear in the text — if something isn't there, use null or an empty array. Never invent names, emails or numbers.\nTask: ${ask}\nReturn ONLY one valid JSON object, no markdown.\n\nWebsite text:\n${corpus}`,
      maxTokens: 900,
      fast: true,
    }).catch(() => null);
    if (r?.ok && r.text) {
      const a = r.text.indexOf("{"), b = r.text.lastIndexOf("}");
      try { if (a > -1 && b > a) result.ai = JSON.parse(r.text.slice(a, b + 1)); } catch {}
    }
    if (!prompt && result.ai?.company_name) result.name = String(result.ai.company_name).slice(0, 80);
  }
  return result;
}
