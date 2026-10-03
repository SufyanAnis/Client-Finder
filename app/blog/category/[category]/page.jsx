import { notFound } from "next/navigation";
import { Page } from "../../../../components/SiteChrome";
import { Breadcrumbs, JsonLd, ToolCta } from "../../../../components/Content";
import { CardGrid } from "../../../../components/Related";
import { blog, BLOG_CATEGORIES } from "../../../../content";
import { absUrl } from "../../../../lib/site";

const BLURBS = {
  "getting-clients": "Where clients come from and how to win the first, the next and the international ones — channels, platforms and playbooks.",
  "cold-outreach": "Cold email, calls and follow-ups that get replies: subject lines, deliverability, timing and volume.",
  "pricing-and-proposals": "What to charge, how to price a project, write the proposal and handle the objections that follow.",
  "growing-your-business": "Niches, portfolios, referrals, retainers and the move from freelancer to agency.",
};

export const dynamicParams = false;
export function generateStaticParams() {
  return BLOG_CATEGORIES.map((c) => ({ category: c.slug }));
}

export function generateMetadata({ params }) {
  const c = BLOG_CATEGORIES.find((x) => x.slug === params.category);
  if (!c) return {};
  return {
    title: `${c.name} for freelancers & agencies`,
    description: BLURBS[c.slug],
    alternates: { canonical: `/blog/category/${c.slug}` },
  };
}

export default function Category({ params }) {
  const c = BLOG_CATEGORIES.find((x) => x.slug === params.category);
  if (!c) notFound();
  const items = blog.filter((p) => p.category === c.name);
  return (
    <Page>
      <Breadcrumbs items={[{ name: "Blog", href: "/blog" }, { name: c.name, href: `/blog/category/${c.slug}` }]} />
      <header className="page-head">
        <h1>{c.name}</h1>
        <p>{BLURBS[c.slug]}</p>
      </header>
      <CardGrid items={items} href={(p) => `/blog/${p.slug}`} kicker={(p) => `${p.readingMinutes} min read`} title={(p) => p.title} text={(p) => p.excerpt} />
      <ToolCta />
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: c.name,
        url: absUrl(`/blog/category/${c.slug}`),
        hasPart: items.map((p) => ({ "@type": "BlogPosting", headline: p.title, url: absUrl(`/blog/${p.slug}`) })),
      }} />
    </Page>
  );
}
