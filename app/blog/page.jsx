import Link from "next/link";
import { Page } from "../../components/SiteChrome";
import { Breadcrumbs, JsonLd, ToolCta } from "../../components/Content";
import { CardGrid } from "../../components/Related";
import AdSlot from "../../components/AdSlot";
import { blog, BLOG_CATEGORIES } from "../../content";
import { ADS, SITE, absUrl } from "../../lib/site";

export const metadata = {
  title: "Blog: getting clients, pricing and outreach for freelancers",
  description:
    "Straight answers for freelancers and small agencies: how to get clients, what to charge, cold email that lands, proposals, retainers and growing into an agency.",
  alternates: { canonical: "/blog", types: { "application/rss+xml": "/feed.xml" } },
};

export default function BlogIndex() {
  return (
    <Page>
      <Breadcrumbs items={[{ name: "Blog", href: "/blog" }]} />
      <header className="page-head">
        <h1>The <em>{SITE.name}</em> blog.</h1>
        <p>Short, practical answers to the questions freelancers and small agencies actually ask — how to get clients, what to charge, and how to reach out without sounding like spam.</p>
        <div className="pills" style={{ marginTop: 18 }}>
          {BLOG_CATEGORIES.map((c) => <Link key={c.slug} href={`/blog/category/${c.slug}`} className="tagpill">{c.name}</Link>)}
          <a href="/feed.xml" className="tagpill">RSS feed</a>
        </div>
      </header>
      {BLOG_CATEGORIES.map((c, i) => {
        const items = blog.filter((p) => p.category === c.name);
        if (!items.length) return null;
        return (
          <section key={c.slug} className="idx-sec">
            <div className="sec-head">
              <h2>{c.name}</h2>
              <Link href={`/blog/category/${c.slug}`} className="more">All {c.name.toLowerCase()} →</Link>
            </div>
            <CardGrid items={items} href={(p) => `/blog/${p.slug}`} kicker={(p) => `${p.readingMinutes} min read`} title={(p) => p.title} text={(p) => p.excerpt} />
            {i === 0 && <AdSlot slot={ADS.slots.display} />}
          </section>
        );
      })}
      <ToolCta />
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "Blog",
        name: `${SITE.name} blog`,
        url: absUrl("/blog"),
        blogPost: blog.map((p) => ({ "@type": "BlogPosting", headline: p.title, url: absUrl(`/blog/${p.slug}`), dateModified: p.updated })),
      }} />
    </Page>
  );
}
