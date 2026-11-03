// lib/feeds.js — free, official job feeds for the /leads board. No keys, no
// scraping: each source publishes this data for reuse.
//   • Hacker News (Algolia API): the monthly "Freelancer? Seeking freelancer?"
//     threads (SEEKING FREELANCER replies) + "Who is hiring?" contract/part-time posts
//   • Remote OK (public JSON API) — their terms require crediting "Remote OK" with
//     a followed link back to the job page, which the board does.
//   • We Work Remotely (public RSS)
// Every item has the same shape:
//   { id, source, title, company, url, category, location, salary, posted }

const HN = "https://hn.algolia.com/api/v1";
const UA = { "user-agent": "FindMyClients/1.0 (+https://findmyclients.vercel.app/leads)" };

const strip = (html) =>
  String(html || "")
    .replace(/<p>/gi, "\n").replace(/<br\s*\/?>/gi, "\n").replace(/<[^>]+>/g, "")
    .replace(/&#x2F;/g, "/").replace(/&#x27;|&#39;/g, "'").replace(/&quot;/g, '"').replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&nbsp;/g, " ").trim();

async function getJson(url) {
  const res = await fetch(url, { headers: UA, cache: "no-store" });
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return res.json();
}

// Rough skill bucket from text, for the board's filter chips.
export function categorize(text) {
  const t = String(text || "").toLowerCase();
  if (/\b(ai|ml|machine learning|llm|data scien|automation|agent)\b/.test(t)) return "AI & data";
  if (/\b(design|designer|ux|ui|figma|brand|illustrat)/.test(t)) return "Design";
  if (/\b(market|seo|growth|content|copywrit|writer|social media)/.test(t)) return "Marketing & content";
  if (/\b(video|editor|motion|animation)/.test(t)) return "Video";
  if (/\b(engineer|developer|dev\b|frontend|front-end|backend|back-end|full[- ]?stack|react|python|node|golang|rust|ios|android|mobile|devops|software|programm)/.test(t)) return "Development";
  return "Other";
}

const money = (t) => (String(t).match(/(?:\$|USD|£|€)\s?\d[\d,.]*\s?[kK]?(?:\s?(?:-|–|to)\s?(?:\$|£|€)?\s?\d[\d,.]*\s?[kK]?)?(?:\s?\/\s?(?:hr|hour|h|yr|year|mo|month))?/) || [])[0] || "";

// ---- Hacker News -------------------------------------------------------------
async function latestThreads(query, author, count) {
  const tags = author ? `story,author_${author}` : "story";
  const j = await getJson(`${HN}/search_by_date?tags=${tags}&query=${encodeURIComponent(query)}&hitsPerPage=10`);
  return j.hits.filter((h) => h.title?.toLowerCase().startsWith(query.toLowerCase())).slice(0, count);
}

export async function hackerNewsLeads() {
  const [freelance, hiring] = await Promise.all([
    latestThreads("Ask HN: Freelancer? Seeking freelancer?", null, 2),
    latestThreads("Ask HN: Who is hiring?", "whoishiring", 1),
  ]);
  const out = [];
  for (const t of freelance) {
    const item = await getJson(`${HN}/items/${t.objectID}`);
    for (const c of item.children || []) {
      const text = strip(c.text);
      if (!/^\s*seeking\s+freelancer/i.test(text)) continue;
      const lines = text.split("\n").map((s) => s.trim()).filter(Boolean);
      const first = lines[0].replace(/^seeking\s+freelancer\s*[:\-|]?\s*/i, "") || lines[1] || "Freelancer wanted";
      out.push({
        id: "hn-" + c.id, source: "Hacker News", title: first.slice(0, 160), company: "",
        url: `https://news.ycombinator.com/item?id=${c.id}`, category: categorize(text),
        location: /remote/i.test(text) ? "Remote" : "", salary: money(text), posted: c.created_at,
        detail: lines.slice(1).join(" ").slice(0, 260),
      });
    }
  }
  for (const t of hiring) {
    const item = await getJson(`${HN}/items/${t.objectID}`);
    for (const c of item.children || []) {
      const text = strip(c.text);
      const first = text.split("\n")[0] || "";
      // contract / freelance / part-time roles only — those are the freelancer-shaped ones
      if (!/\b(contract|contractor|freelanc|part[- ]time)/i.test(first)) continue;
      const parts = first.split("|").map((s) => s.trim()).filter(Boolean);
      if (parts.length < 2) continue; // not in the usual "Company | Role | ..." format
      out.push({
        id: "hn-" + c.id, source: "Hacker News", title: (parts.slice(1).join(" · ") || first).slice(0, 160),
        company: (parts[0] || "").slice(0, 80), url: `https://news.ycombinator.com/item?id=${c.id}`,
        category: categorize(first), location: /remote/i.test(first) ? "Remote" : (parts.find((p) => /,|onsite|hybrid/i.test(p)) || ""),
        salary: money(first), posted: c.created_at, detail: text.split("\n").slice(1).join(" ").slice(0, 260),
      });
    }
  }
  return out.sort((a, b) => (a.posted < b.posted ? 1 : -1));
}

// ---- Remote OK ---------------------------------------------------------------
// Roles a freelancer could plausibly take on; drops support, sales ops, admin, etc.
export const FREELANCE_CATS = ["Development", "Design", "Marketing & content", "Video", "AI & data"];
const freelanceShaped = (x) => FREELANCE_CATS.includes(x.category);

export async function remoteOkLeads({ maxAgeDays = 14 } = {}) {
  const j = await getJson("https://remoteok.com/api");
  const cutoff = Date.now() - maxAgeDays * 86400000;
  return j
    .filter((x) => x && x.id && x.position && Date.parse(x.date) >= cutoff)
    .map((x) => ({
      id: "rok-" + x.id, source: "Remote OK", title: strip(x.position).slice(0, 160), company: strip(x.company).slice(0, 80),
      url: x.url, category: categorize(x.position), location: strip(x.location) || "Remote",
      salary: x.salary_min ? `$${Math.round(x.salary_min / 1000)}k–$${Math.round((x.salary_max || x.salary_min) / 1000)}k/yr` : "",
      posted: x.date,
    }))
    .filter(freelanceShaped);
}

// ---- We Work Remotely -------------------------------------------------------------
export async function weWorkRemotelyLeads({ maxAgeDays = 14 } = {}) {
  const res = await fetch("https://weworkremotely.com/remote-jobs.rss", { headers: UA, cache: "no-store" });
  if (!res.ok) throw new Error("WWR " + res.status);
  const xml = await res.text();
  const tag = (block, name) => (block.match(new RegExp(`<${name}>(?:<!\\[CDATA\\[)?([\\s\\S]*?)(?:\\]\\]>)?</${name}>`)) || [])[1]?.trim() || "";
  const cutoff = Date.now() - maxAgeDays * 86400000;
  return [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)]
    .map((m) => {
      const b = m[1];
      const full = strip(tag(b, "title"));
      const i = full.indexOf(":");
      const link = tag(b, "link") || tag(b, "guid");
      const posted = new Date(tag(b, "pubDate")).toISOString();
      return {
        id: "wwr-" + (link.split("/").pop() || full).slice(0, 80), source: "We Work Remotely",
        title: (i > 0 ? full.slice(i + 1) : full).trim().slice(0, 160), company: i > 0 ? full.slice(0, i).trim().slice(0, 80) : "",
        // the job title decides; WWR's own category is only a fallback (it's often broad)
        url: link, category: categorize(full) !== "Other" ? categorize(full) : categorize(tag(b, "category")), location: strip(tag(b, "region")) || "Remote",
        salary: "", posted,
      };
    })
    .filter((x) => x.url && Date.parse(x.posted) >= cutoff && freelanceShaped(x));
}

// ---- more free job APIs ---------------------------------------------------------
// Each requires/asks for a credited, followed link back to the job page — the
// board shows "via <source>" and links to their job page.
const typeOf = (s) => (/freelanc/i.test(s) ? "Freelance" : /contract/i.test(s) ? "Contract" : /part/i.test(s) ? "Part-time" : "");
const recent = (iso, days) => Date.parse(iso) >= Date.now() - days * 86400000;

export async function remotiveLeads({ maxAgeDays = 14 } = {}) {
  const j = await getJson("https://remotive.com/api/remote-jobs?limit=200"); // Remotive asks for ≤ a few calls/day — we cache 6h
  return (j.jobs || [])
    .map((x) => ({
      id: "rem-" + x.id, source: "Remotive", title: strip(x.title).slice(0, 160), company: strip(x.company_name).slice(0, 80),
      url: x.url, category: categorize(x.title), location: strip(x.candidate_required_location) || "Remote",
      salary: strip(x.salary || "").slice(0, 40), posted: new Date(x.publication_date).toISOString(), jobType: typeOf(x.job_type || ""),
    }))
    .filter((x) => recent(x.posted, maxAgeDays) && freelanceShaped(x));
}

export async function arbeitnowLeads({ maxAgeDays = 14 } = {}) {
  const j = await getJson("https://www.arbeitnow.com/api/job-board-api");
  return (j.data || [])
    .filter((x) => x.remote || /remote/i.test(x.location || "") || (x.job_types || []).some((t) => /contract|freelanc|part/i.test(t)))
    .map((x) => ({
      id: "arb-" + x.slug, source: "Arbeitnow", title: strip(x.title).slice(0, 160), company: strip(x.company_name).slice(0, 80),
      url: x.url, category: categorize(x.title), location: strip(x.location) || "Remote", salary: "",
      posted: new Date(x.created_at * 1000).toISOString(), jobType: typeOf((x.job_types || []).join(" ")),
    }))
    .filter((x) => recent(x.posted, maxAgeDays) && freelanceShaped(x));
}

export async function jobicyLeads({ maxAgeDays = 14 } = {}) {
  const j = await getJson("https://jobicy.com/api/v2/remote-jobs?count=100");
  return (j.jobs || [])
    .map((x) => ({
      id: "jcy-" + x.id, source: "Jobicy", title: strip(x.jobTitle).slice(0, 160), company: strip(x.companyName).slice(0, 80),
      url: x.url, category: categorize(x.jobTitle), location: strip(x.jobGeo) || "Remote",
      salary: x.annualSalaryMin ? `${x.salaryCurrency || "$"} ${Math.round(x.annualSalaryMin / 1000)}k–${Math.round((x.annualSalaryMax || x.annualSalaryMin) / 1000)}k/yr` : "",
      posted: new Date(x.pubDate).toISOString(), jobType: typeOf((x.jobType || []).join(" ")),
    }))
    .filter((x) => recent(x.posted, maxAgeDays) && freelanceShaped(x));
}

export async function himalayasLeads({ maxAgeDays = 14 } = {}) {
  const j = await getJson("https://himalayas.app/jobs/api?limit=100");
  return (j.jobs || [])
    .map((x) => ({
      id: "him-" + (x.guid || x.applicationLink || x.title).split("/").slice(-2).join("-").slice(0, 90), source: "Himalayas",
      title: strip(x.title).slice(0, 160), company: strip(x.companyName).slice(0, 80), url: x.guid || x.applicationLink,
      category: categorize(`${x.title} ${(x.parentCategories || []).join(" ")}`), location: (x.locationRestrictions || []).slice(0, 3).join(", ") || "Anywhere",
      salary: x.minSalary ? `${x.currency || "$"} ${Math.round(x.minSalary / 1000)}k–${Math.round((x.maxSalary || x.minSalary) / 1000)}k/yr` : "",
      posted: new Date(x.pubDate * 1000).toISOString(), jobType: typeOf(x.employmentType || ""),
    }))
    .filter((x) => x.url && recent(x.posted, maxAgeDays) && freelanceShaped(x));
}

// ---- new product launches (Show HN / Launch HN) ------------------------------------
// A brand-new product usually needs design, marketing, content and dev help —
// the launch post links straight to the founder's product site.
export async function launchLeads({ days = 7 } = {}) {
  const since = Math.floor(Date.now() / 1000) - days * 86400;
  const [show, launch] = await Promise.all([
    getJson(`${HN}/search_by_date?tags=show_hn&numericFilters=created_at_i>${since},points>2&hitsPerPage=100`),
    getJson(`${HN}/search_by_date?tags=story&query=${encodeURIComponent("Launch HN")}&numericFilters=created_at_i>${since}&hitsPerPage=30`),
  ]);
  const hits = [...(show.hits || []), ...(launch.hits || []).filter((h) => /^Launch HN:/i.test(h.title || ""))];
  const seen = new Set();
  return hits
    .filter((h) => h.url && !seen.has(h.objectID) && seen.add(h.objectID))
    .map((h) => {
      const t = strip(h.title).replace(/^(Show|Launch) HN:\s*/i, "");
      const [name, ...rest] = t.split(/\s[–—-]\s/);
      return {
        id: "launch-" + h.objectID, source: /^Launch/i.test(h.title) ? "Launch HN" : "Show HN",
        title: (rest.join(" — ") || t).slice(0, 160), company: name.slice(0, 60), url: h.url,
        category: categorize(t), location: "", salary: "", posted: h.created_at,
        detail: `${h.points} points · ${h.num_comments || 0} comments · discussion: news.ycombinator.com/item?id=${h.objectID}`,
        points: h.points,
      };
    })
    .sort((a, b) => b.points - a.points);
}
