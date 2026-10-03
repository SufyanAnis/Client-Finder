import { notFound } from "next/navigation";
import Link from "next/link";
import { Page } from "../../../components/SiteChrome";
import { Blocks, Breadcrumbs, JsonLd, ToolCta, Rich, plainText } from "../../../components/Content";
import { RelatedLinks } from "../../../components/Related";
import { glossary, getTerm, resolveRelated } from "../../../content";
import { SITE, absUrl } from "../../../lib/site";

export const dynamicParams = false;
export function generateStaticParams() {
  return glossary.map((t) => ({ slug: t.slug }));
}

export function generateMetadata({ params }) {
  const t = getTerm(params.slug);
  if (!t) return {};
  const url = `/glossary/${t.slug}`;
  return {
    title: t.metaTitle || `What is ${t.term}?`,
    description: t.description,
    alternates: { canonical: url },
    openGraph: { type: "article", url, title: t.metaTitle || t.term, description: t.description },
  };
}

export default function TermPage({ params }) {
  const t = getTerm(params.slug);
  if (!t) notFound();
  const rel = resolveRelated(t.related);
  const url = `/glossary/${t.slug}`;
  const i = glossary.findIndex((x) => x.slug === t.slug);
  const prev = glossary[i - 1], next = glossary[i + 1];

  return (
    <Page narrow>
      <Breadcrumbs items={[{ name: "Glossary", href: "/glossary" }, { name: t.term, href: url }]} />
      <article className="article">
        <header className="art-head">
          <div className="kicker">Glossary</div>
          <h1>What is {/^[A-Z]{2,}/.test(t.term) ? t.term : t.term.toLowerCase()}?</h1>
        </header>
        <div className="answer" id="short-answer">
          <div className="label">Definition</div>
          <p><Rich text={t.short} /></p>
        </div>
        <div className="prose">
          <Blocks blocks={t.blocks} />
          {t.example && (
            <div className="tip"><span className="tip-k">Example</span><p><Rich text={t.example} /></p></div>
          )}
        </div>
        <nav className="pager" aria-label="More terms">
          {prev ? <Link href={`/glossary/${prev.slug}`}>← {prev.term}</Link> : <span />}
          <Link href="/glossary">All terms</Link>
          {next ? <Link href={`/glossary/${next.slug}`}>{next.term} →</Link> : <span />}
        </nav>
        <ToolCta />
      </article>
      <RelatedLinks rel={rel} />
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "DefinedTerm",
        name: t.term,
        description: plainText(t.short),
        url: absUrl(url),
        inDefinedTermSet: { "@type": "DefinedTermSet", name: `${SITE.name} glossary`, url: absUrl("/glossary") },
      }} />
    </Page>
  );
}
