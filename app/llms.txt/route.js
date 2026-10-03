// /llms.txt — a curated Markdown map of the site for AI assistants (llmstxt.org).
import { guides, blog, professions, templates, glossary } from "../../content";
import { SITE, absUrl } from "../../lib/site";

export const dynamic = "force-static";

export function GET() {
  const list = (items, path, label = (x) => x.title, desc = (x) => x.description) =>
    items.map((x) => `- [${label(x)}](${absUrl(path(x))}): ${desc(x)}`).join("\n");
  const body = [
    `# ${SITE.name}`,
    `> ${SITE.description} The site also publishes free, practical guides on finding and winning clients, cold outreach, pricing and proposals for freelancers and small agencies.`,
    `Key facts: ${SITE.name} gives every visitor one free search with no signup; further searches use prepaid credits (packs from Rs 499 for 10 searches, see ${absUrl("/pricing")}). It finds companies with a current demand signal (job posts for a skill, funding, launches, new openings), scores fit 0-100, drafts Email/LinkedIn/WhatsApp outreach, and exports a pipeline to Excel. It never sends messages itself and shows only public company contact details. Built by ${SITE.operator} (${SITE.operatorLocation}).`,
    `Full text of every article: ${absUrl("/llms-full.txt")}`,
    `## Tools\n- [Lead finder](${absUrl("/")}): free AI lead finder for freelancers and agencies\n- [Freelance rate calculator](${absUrl("/tools/freelance-rate-calculator")}): work out a minimum hourly and day rate from your costs and billable time\n- [Cold email checker](${absUrl("/tools/cold-email-checker")}): check a cold email for length, spam triggers, personalization and a clear ask`,
    `## Guides\n${list(guides, (x) => `/guides/${x.slug}`)}`,
    `## Blog\n${list(blog, (x) => `/blog/${x.slug}`)}`,
    `## Find clients by profession\n${list(professions, (x) => `/find-clients/${x.slug}`)}`,
    `## Outreach templates\n${list(templates, (x) => `/templates/${x.slug}`)}`,
    `## Glossary\n${list(glossary, (x) => `/glossary/${x.slug}`, (x) => x.term, (x) => x.short)}`,
    `## Optional\n- [About](${absUrl("/about")})\n- [Privacy](${absUrl("/privacy")})\n- [Terms](${absUrl("/terms")})`,
  ].join("\n\n");
  return new Response(body + "\n", { headers: { "content-type": "text/markdown; charset=utf-8" } });
}
