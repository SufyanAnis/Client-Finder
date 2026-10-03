import { notFound } from "next/navigation";
import Link from "next/link";
import { Page } from "../../../components/SiteChrome";
import { Blocks, Breadcrumbs, Faqs, JsonLd, ToolCta, Rich, slugify, AnswerBox, Byline } from "../../../components/Content";
import { RelatedLinks } from "../../../components/Related";
import AdSlot from "../../../components/AdSlot";
import { blog, getPost, resolveRelated, BLOG_CATEGORIES } from "../../../content";
import { ADS } from "../../../lib/site";
import { DEFAULT_AUTHOR } from "../../../lib/authors";
import { articleLd, howToLd, wordCount } from "../../../lib/schema";

export const dynamicParams = false;
export function generateStaticParams() {
  return blog.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }) {
  const p = getPost(params.slug);
  if (!p) return {};
  const url = `/blog/${p.slug}`;
  return {
    title: p.metaTitle || p.title,
    description: p.description,
    alternates: { canonical: url },
    authors: [{ name: DEFAULT_AUTHOR.name, url: `/authors/${DEFAULT_AUTHOR.slug}` }],
    openGraph: {
      type: "article", url, title: p.title, description: p.description,
      publishedTime: p.published, modifiedTime: p.updated, authors: [DEFAULT_AUTHOR.name], section: p.category,
    },
  };
}

export default function BlogPost({ params }) {
  const p = getPost(params.slug);
  if (!p) notFound();
  const rel = resolveRelated(p.related);
  const url = `/blog/${p.slug}`;
  const cat = BLOG_CATEGORIES.find((c) => c.name === p.category);
  // Two other posts from the same category keep readers (and crawlers) moving.
  const more = blog.filter((x) => x.category === p.category && x.slug !== p.slug && !rel.blog.some((r) => r.slug === x.slug)).slice(0, 3);

  return (
    <Page narrow>
      <Breadcrumbs items={[
        { name: "Blog", href: "/blog" },
        ...(cat ? [{ name: cat.name, href: `/blog/category/${cat.slug}` }] : []),
        { name: p.title, href: url },
      ]} />
      <article className="article">
        <header className="art-head">
          {cat ? <Link className="kicker" href={`/blog/category/${cat.slug}`}>{cat.name}</Link> : <div className="kicker">{p.category}</div>}
          <h1>{p.title}</h1>
          <Byline author={DEFAULT_AUTHOR} published={p.published} updated={p.updated} minutes={p.readingMinutes} />
        </header>

        <AnswerBox answer={p.answer} />

        {p.keyTakeaways?.length > 0 && (
          <div className="takeaways">
            <div className="label">Key takeaways</div>
            <ul>{p.keyTakeaways.map((t, i) => <li key={i}><Rich text={t} /></li>)}</ul>
          </div>
        )}

        <nav className="toc" aria-label="On this page">
          <div className="label">On this page</div>
          <ol>{p.sections.map((s) => <li key={s.heading}><a href={"#" + slugify(s.heading)}>{s.heading}</a></li>)}</ol>
        </nav>

        <div className="prose">
          {p.sections.map((s, i) => (
            <section key={s.heading}>
              <h2 id={slugify(s.heading)}>{s.heading}</h2>
              <Blocks blocks={s.blocks} />
              {(i === 1 || i === 4) && i < p.sections.length - 1 && <AdSlot slot={ADS.slots.inArticle} layout="in-article" />}
            </section>
          ))}
        </div>

        {p.sources?.length > 0 && (
          <section className="sources">
            <div className="label">Sources</div>
            <ul>{p.sources.map((s) => <li key={s.url}><a href={s.url} target="_blank" rel="noopener">{s.label}</a></li>)}</ul>
          </section>
        )}

        <ToolCta />
        <Faqs faqs={p.faqs} />
      </article>

      <RelatedLinks rel={{ ...rel, blog: [...rel.blog, ...more] }} />
      <AdSlot slot={ADS.slots.multiplex} format="autorelaxed" />

      <JsonLd data={articleLd({
        type: "BlogPosting", title: p.title, description: p.description, path: url,
        published: p.published, updated: p.updated, author: DEFAULT_AUTHOR,
        image: `${url}/opengraph-image`, section: p.category, words: wordCount(p.sections),
      })} />
      {p.howTo && <JsonLd data={howToLd({ howTo: p.howTo, path: url })} />}
    </Page>
  );
}
