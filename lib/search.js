// lib/search.js
// Free web search via Tavily (https://tavily.com) for LLM providers that have
// no native search tool (e.g. Groq). The find-leads route feeds these results
// to the model so it extracts REAL companies instead of inventing them.

const TAVILY_URL = "https://api.tavily.com/search";

export function searchAvailable() {
  return !!process.env.TAVILY_API_KEY;
}

// Applicant-tracking systems that host companies' OWN job posts. A result on
// one of these names the actual hiring company — unlike job boards, whose
// listing pages bury it among dozens of others.
export const ATS_DOMAINS = [
  "boards.greenhouse.io", "job-boards.greenhouse.io", "jobs.lever.co", "jobs.ashbyhq.com",
  "apply.workable.com", "jobs.smartrecruiters.com", "bamboohr.com", "recruitee.com",
  "teamtailor.com", "jobs.personio.de", "breezy.hr", "wellfound.com/company",
];

// Talent marketplaces and aggregators: never the end client.
export const NOISE_DOMAINS = [
  "indeed.com", "linkedin.com", "upwork.com", "fiverr.com", "glassdoor.com", "ziprecruiter.com",
  "toptal.com", "arc.dev", "freelancer.com", "guru.com", "peopleperhour.com", "reddit.com",
  "totaljobs.com", "reed.co.uk", "monster.com", "simplyhired.com", "clutch.co", "goodfirms.co",
];

// Returns [{ title, url, content }]. Throws on transport/API error (err.detail
// carries the upstream body). Each call costs one Tavily credit at basic depth.
export async function webSearch(query, maxResults = 10, opts = {}) {
  const key = process.env.TAVILY_API_KEY;
  if (!key) throw new Error("TAVILY_API_KEY is not set");

  const res = await fetch(TAVILY_URL, {
    method: "POST",
    headers: { "content-type": "application/json", Authorization: `Bearer ${key}` },
    body: JSON.stringify({
      query,
      max_results: maxResults,
      search_depth: "basic",
      topic: opts.topic || "general",
      include_answer: false,
      ...(opts.timeRange ? { time_range: opts.timeRange } : {}),
      ...(opts.includeDomains ? { include_domains: opts.includeDomains } : {}),
      ...(opts.excludeDomains ? { exclude_domains: opts.excludeDomains } : {}),
    }),
  });
  if (!res.ok) {
    const err = new Error("Tavily search error " + res.status);
    err.detail = (await res.text()).slice(0, 300);
    throw err;
  }
  const data = await res.json();
  return (data.results || []).map((r) => ({
    title: r.title || "",
    url: r.url || "",
    content: (r.content || "").slice(0, 900),
  }));
}
