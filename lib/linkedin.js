// lib/linkedin.js — public LinkedIn job posts for freelance/contract work, found
// through web search (Tavily, restricted to linkedin.com/jobs). No login, no
// browser automation: these job pages are public and indexed by search engines.
// Staffing agencies and job aggregators are dropped — they're not the end client.
import { webSearch } from "./search";
import { categorize } from "./feeds";

const AGGREGATORS = /\b(robert half|aquent|twine|torentify|hired|remotehunter|wiraa|crewlia|jobot|insight global|teksystems|randstad|kforce|dice|upwork|toptal|braintrust|mercor|outlier|dataannotation|adecco|manpower|kelly services|creative circle|vitamin t|24 seven|lhh|apex systems|cybercoders|motion recruitment)\b/i;

export const LINKEDIN_QUERIES = [
  "freelance web developer contract remote",
  "freelance graphic designer OR web designer contract",
  "freelance video editor OR motion designer contract",
  "freelance copywriter OR content writer OR social media marketing contract",
];

// "Role at Company — Location | LinkedIn Jobs"
export function parseLinkedInJob(r) {
  const id = (r.url.match(/linkedin\.com\/jobs\/view\/(?:[^/?#]*?-)?(\d{6,})/) || [])[1];
  if (!id) return null;
  const t = r.title.replace(/\s*[|-]\s*(?:Jobs\s*-\s*)?LinkedIn(?: Jobs)?\s*$/i, "").replace(/\s*-\s*Jobs\s*$/i, "").trim();
  // Split on the LAST " at " (roles can contain dashes), then "Company — Location".
  const at = t.lastIndexOf(" at ");
  let role, company = "", location = "";
  if (at > 0) {
    role = t.slice(0, at).trim();
    [company, location = ""] = t.slice(at + 4).split(/\s+—\s+/);
  } else {
    role = t.split(/\s+—\s+/)[0]; // no " at ": keep just the role, don't guess the rest
  }
  role = role.replace(/\s+—\s+/g, " — ");
  company = company.replace(/\.\.\.$/, "").trim();
  if (!role || AGGREGATORS.test(company) || AGGREGATORS.test(role)) return null;
  return {
    id: "li-" + id,
    source: "LinkedIn",
    title: role.slice(0, 160),
    company: company.slice(0, 80),
    url: `https://www.linkedin.com/jobs/view/${id}/`,
    category: categorize(role),
    location: location.trim().slice(0, 80),
    salary: "",
    posted: "",
    jobId: Number(id),
  };
}

export async function linkedInLeads(queries = LINKEDIN_QUERIES) {
  const lists = await Promise.all(
    queries.map((q) => webSearch(q, 15, { includeDomains: ["linkedin.com/jobs"], timeRange: "week" }).catch(() => []))
  );
  const seen = new Set();
  const out = [];
  for (const r of lists.flat()) {
    const j = parseLinkedInJob(r);
    if (!j || seen.has(j.id)) continue;
    seen.add(j.id);
    out.push(j);
  }
  // LinkedIn job ids increase over time — higher id = newer post.
  return out.sort((a, b) => b.jobId - a.jobId);
}
