// lib/twitter.js — public X/Twitter posts from people and companies hiring, found
// through web search (Tavily, restricted to x.com / twitter.com). X's own API
// costs ~$200/month and scraping it needs a logged-in account, so this only uses
// tweets that search engines have already indexed.
// Kept: individual tweets whose text shows hiring intent. Dropped: people
// advertising themselves, "N websites to earn online" lists, advice threads.
import { webSearch } from "./search";
import { categorize } from "./feeds";

const INTENT = /\b(we['’]?re hiring|hiring|is looking for|looking for an? |looking to hire|seeking an? |need an? |in search of|vacancy|open role|now hiring)\b/i;
const NOT_LEAD = /\b(for hire|available for (work|hire|projects)|dm me for|my portfolio|i build|i design|i create|i will|i can help|hire me|open to work|commissions? (are )?open|websites? to (explore|earn)|platforms? (you should|to)|ways to earn|how to (get|find|land)|tips|thread)\b|earn online|crowdtesting|not hiring/i;

export function parseTweet(r) {
  const m = r.url.match(/(?:x|twitter)\.com\/([A-Za-z0-9_]{1,15})\/status\/(\d+)/);
  if (!m) return null;
  const [, handle, id] = m;
  // Title looks like: Name on X: "tweet text" / X
  const fromTitle = (r.title.match(/on X:\s*["“](.+?)["”]?(?:\s*\/\s*X)?$/) || [])[1] || "";
  const decode = (s) => s.replace(/&#39;|&#x27;|&apos;/g, "'").replace(/&quot;/g, '"').replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">");
  const text = decode(r.content || fromTitle || r.title)
    .replace(/^#\s*.+? on X:\s*["“]?/, "") // search snippets sometimes start with the page heading
    .replace(/\s+/g, " ").trim();
  const head = (fromTitle ? decode(fromTitle) : text).slice(0, 400);
  if (!INTENT.test(head) || NOT_LEAD.test(head)) return null;
  const name = (r.title.match(/^(.+?) on X:/) || [])[1]?.replace(/[^\p{L}\p{N}\s.&'-]/gu, "").trim() || "@" + handle;
  return {
    id: "x-" + id,
    source: "X (Twitter)",
    title: head.slice(0, 220),
    company: name.slice(0, 60),
    url: `https://x.com/${handle}/status/${id}`,
    category: categorize(head),
    location: /remote/i.test(head) ? "Remote" : "",
    salary: (head.match(/(?:\$|£|€)\s?\d[\d,.]*\s?[kK]?(?:\s?(?:-|–|to)\s?(?:\$|£|€)?\s?\d[\d,.]*\s?[kK]?)?(?:\s?\/\s?(?:hr|hour|h|mo|month))?/) || [])[0] || "",
    posted: new Date(Number(BigInt(id) >> 22n) + 1288834974657).toISOString(), // tweet ids embed their timestamp
  };
}

export const X_QUERIES = [
  "hiring freelance designer",
  "looking for a freelance developer",
  "hiring freelance video editor OR copywriter OR marketer",
];

export async function twitterLeads(queries = X_QUERIES, { maxAgeDays = 10 } = {}) {
  const lists = await Promise.all(
    queries.map((q) => webSearch(q, 15, { includeDomains: ["x.com", "twitter.com"], timeRange: "week" }).catch(() => []))
  );
  const cutoff = Date.now() - maxAgeDays * 86400000;
  const seen = new Set();
  const out = [];
  for (const r of lists.flat()) {
    const t = parseTweet(r);
    if (!t || seen.has(t.id) || Date.parse(t.posted) < cutoff) continue;
    seen.add(t.id);
    out.push(t);
  }
  return out.sort((a, b) => (a.posted < b.posted ? 1 : -1));
}

// Finder mode: search phrasings for one service.
const TERMS = {
  "Web development": "web developer", "Web design": "web designer", "Mobile app development": "app developer",
  "SEO": "SEO", "Graphic design & branding": "graphic designer", "Copywriting & content": "copywriter",
  "Video editing & production": "video editor", "Social media management": "social media manager",
  "UX/UI design": "UI designer", "Marketing agency services": "marketer", "Bookkeeping & accounting": "bookkeeper",
  "AI & automation": "AI developer",
};
export const xQueries = (service) => { const t = TERMS[service] || service; return [`hiring freelance ${t}`, `looking for a ${t}`]; };
