// lib/reddit.js — public Reddit "[Hiring]" posts as leads, found through Tavily
// web search restricted to reddit.com (Reddit's own API needs paid approval for
// commercial use, and reddit.com blocks most cloud servers).
//
// Search results are noisy — "[For Hire]" ads, discussions, sidebar snippets —
// so a post only counts when ITS OWN title/URL slug starts like a hiring post.
// Everything shown comes straight from the result (title, subreddit, link); no
// AI rewriting, so nothing can be invented.

import { webSearch } from "./search";

const SLUG_RE = /\/r\/([^/]+)\/comments\/([a-z0-9]+)\/([^/?#]+)/i;
const HIRING_START = /^(hiring|hire_|looking_for|looking_to_hire|lf_|seeking|paid_|need_someone|need_a_(?:freelance_)?[a-z]+_?(?:developer|dev|designer|editor|writer|copywriter|marketer|manager|artist|coder|programmer|expert|specialist|va|assistant))/;
// …and drop job seekers ("looking for a job/opportunities") and discussions.
const NOT_HIRING = /for_?hire|forhire|available|^i_|_i_can_|_i_will_|_i_build_|is_hiring|offering|portfolio|open_for_work|opportunit|looking_for_(?:a_|an_|my_|some_)?(?:new_)?(?:job|work|gig|internship|role|position|clients|freelance_work)|_or_not|job_search|need_a_job|seeking_(?:job|work|employment|a_job)|hiring_managers|how_to|advice|^(?:looking_for|seeking|lf|searching_for)_.*_(?:job|jobs|role|roles|position|internship|employment)(?:_|$)/;

export function parseRedditPost(r) {
  const m = r.url.match(SLUG_RE);
  if (!m) return null;
  const [, sub, id, slug] = m;
  const s = slug.toLowerCase();
  const title = r.title.replace(/\s*[:|-]\s*r\/[A-Za-z0-9_]+.*$/i, "").replace(/\s*-\s*Reddit\s*$/i, "").trim();
  const t = title.toLowerCase();
  const titleHiring = /^\[?\s*(hiring|task|paid)\b/.test(t) || /^\[(hiring|task|paid)\]/i.test(title);
  if (NOT_HIRING.test(s) || /\bfor\s*hire\b/.test(t)) return null;
  if (!HIRING_START.test(s) && !titleHiring) return null;
  const budget = (title.match(/(?:\$|USD|£|€|₹|INR|Rs\.?)\s?\d[\d,.]*(?:\s?[kK])?(?:\s?(?:-|–|to)\s?(?:\$|USD|£|€|₹)?\s?\d[\d,.]*(?:\s?[kK])?)?(?:\s?\/\s?(?:hr|hour|h|mo|month|yr|year))?/) || [])[0] || "";
  return {
    id,
    title: title.slice(0, 200),
    subreddit: sub,
    url: `https://www.reddit.com/r/${sub}/comments/${id}/${slug}/`,
    budget: budget.trim(),
  };
}

// Runs each query (one Tavily credit each) and returns de-duplicated hiring posts.
export async function findHiringPosts(queries, { perQuery = 15, timeRange = "week" } = {}) {
  const lists = await Promise.all(
    queries.map((q) => webSearch(q, perQuery, { includeDomains: ["reddit.com"], timeRange }).catch(() => []))
  );
  const seen = new Set();
  const out = [];
  for (const r of lists.flat()) {
    const p = parseRedditPost(r);
    if (!p || seen.has(p.id)) continue;
    seen.add(p.id);
    out.push(p);
  }
  // Reddit post ids are base-36 and increase over time, so a bigger id is newer.
  return out.sort((a, b) => parseInt(b.id, 36) - parseInt(a.id, 36));
}

// Search phrasings per service, for the finder's Reddit mode.
const TERMS = {
  "Web development": ["web developer", "website developer"],
  "Web design": ["web designer", "website design"],
  "Mobile app development": ["app developer", "mobile app"],
  "SEO": ["SEO", "SEO expert"],
  "Graphic design & branding": ["logo designer", "graphic designer"],
  "Copywriting & content": ["writer", "copywriter"],
  "Video editing & production": ["video editor", "youtube editor"],
  "Social media management": ["social media manager", "social media"],
  "UX/UI design": ["UI designer", "UX designer"],
  "Marketing agency services": ["marketer", "marketing"],
  "Bookkeeping & accounting": ["bookkeeper", "accountant"],
  "AI & automation": ["AI developer", "automation"],
};

export function redditQueries(service, niche = "") {
  const [a, b] = TERMS[service] || [service, service];
  const n = niche ? ` ${niche}` : "";
  return [`[Hiring] ${a}${n}`, `looking to hire ${b}${n}`];
}

// The public bulk-leads board: categories × two phrasings each.
export const BOARD = [
  { slug: "development", name: "Web & app development", queries: ["[Hiring] web developer", "[Hiring] app developer"] },
  { slug: "design", name: "Design & branding", queries: ["[Hiring] logo designer", "[Hiring] UI designer"] },
  { slug: "video", name: "Video & thumbnails", queries: ["[Hiring] video editor", "[Hiring] thumbnail designer"] },
  { slug: "writing", name: "Writing & content", queries: ["[Hiring] writer", "[Hiring] copywriter"] },
  { slug: "marketing", name: "Marketing & SEO", queries: ["[Hiring] SEO", "[Hiring] social media manager"] },
  { slug: "ai", name: "AI & automation", queries: ["[Hiring] AI developer", "[Hiring] automation"] },
];
