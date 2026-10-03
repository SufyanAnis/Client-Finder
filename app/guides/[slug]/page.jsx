import { notFound } from "next/navigation";
import Link from "next/link";
import { Page } from "../../../components/SiteChrome";
import { Blocks, Breadcrumbs, Faqs, JsonLd, ToolCta, Rich, slugify, Byline } from "../../../components/Content";
import { DEFAULT_AUTHOR } from "../../../lib/authors";
import { articleLd, wordCount } from "../../../lib/schema";
import { RelatedLinks } from "../../../components/Related";
import AdSlot from "../../../components/AdSlot";
import { guides, getGuide, resolveRelated } from "../../../content";
import { ADS } from "../../../lib/site";

export const dynamicParams = false;
export function generateStaticParams() {
  return guides.map((g) => ({ slug: g.slug }));
}

export function generateMetadata({ params }) {
  const g = getGuide(params.slug);
  if (!g) return {};
  const url = `/guides/${g.slug}`;
  return {
    title: g.metaTitle || g.title,
    description: g.description,
    alternates: { canonical: url },
    openGraph: { type: "article", url, title: g.title, description: g.description, modifiedTime: g.updated },
  };
}

export default function GuidePage({ params }) {
  const g = getGuide(params.slug);
  if (!g) notFound();
  const rel = resolveRelated(g.related);
  const url = `/guides/${g.slug}`;

  return (
    <Page narrow>
      <Breadcrumbs items={[{ name: "Guides", href: "/guides" }, { name: g.title, href: url }]} />
      <article className="article">
        <header className="art-head">
          <div className="kicker">{g.category}</div>
          <h1>{g.title}</h1>
          <p className="lede">{g.excerpt}</p>
          <Byline author={DEFAULT_AUTHOR} updated={g.updated} minutes={g.readingMinutes} />
        </header>

        {g.keyTakeaways?.length > 0 && (
          <div className="takeaways">
            <div className="label">Key takeaways</div>
            <ul>{g.keyTakeaways.map((t, i) => <li key={i}><Rich text={t} /></li>)}</ul>
          </div>
        )}

        <nav className="toc" aria-label="On this page">
          <div className="label">On this page</div>
          <ol>{g.sections.map((s) => <li key={s.heading}><a href={"#" + slugify(s.heading)}>{s.heading}</a></li>)}</ol>
        </nav>

        <div className="prose">
          {g.sections.map((s, i) => (
            <section key={s.heading}>
              <h2 id={slugify(s.heading)}>{s.heading}</h2>
              <Blocks blocks={s.blocks} />
              {(i === 1 || i === 4) && i < g.sections.length - 1 && <AdSlot slot={ADS.slots.inArticle} layout="in-article" />}
            </section>
          ))}
        </div>

        <ToolCta />
        <Faqs faqs={g.faqs} />
      </article>

      <RelatedLinks rel={rel} />
      <AdSlot slot={ADS.slots.multiplex} format="autorelaxed" />

      <JsonLd data={articleLd({ title: g.title, description: g.description, path: url, updated: g.updated, author: DEFAULT_AUTHOR, section: g.category, words: wordCount(g.sections) })} />
    </Page>
  );
}

