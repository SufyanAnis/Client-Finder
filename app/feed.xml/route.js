// /feed.xml — RSS 2.0 feed of blog posts and guides (feed readers, aggregators, faster discovery).
import { blog, guides } from "../../content";
import { SITE, absUrl } from "../../lib/site";

export const dynamic = "force-static";

const esc = (s) => String(s || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export function GET() {
  const items = [
    ...blog.map((p) => ({ ...p, path: `/blog/${p.slug}`, date: p.published || p.updated })),
    ...guides.map((g) => ({ ...g, path: `/guides/${g.slug}`, date: g.updated })),
  ].sort((a, b) => (a.date < b.date ? 1 : -1));
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
<title>${esc(SITE.name)}</title>
<link>${SITE.url}</link>
<description>${esc(SITE.description)}</description>
<language>en</language>
<atom:link href="${absUrl("/feed.xml")}" rel="self" type="application/rss+xml"/>
${items.map((x) => `<item>
<title>${esc(x.title)}</title>
<link>${absUrl(x.path)}</link>
<guid isPermaLink="true">${absUrl(x.path)}</guid>
<pubDate>${new Date(x.date + "T09:00:00Z").toUTCString()}</pubDate>
<category>${esc(x.category)}</category>
<description>${esc(x.answer || x.excerpt || x.description)}</description>
</item>`).join("\n")}
</channel>
</rss>`;
  return new Response(xml, { headers: { "content-type": "application/rss+xml; charset=utf-8" } });
}
