import { notFound } from "next/navigation";
import { Page } from "../../../components/SiteChrome";
import { Breadcrumbs, JsonLd, ToolCta, Rich, Example } from "../../../components/Content";
import { RelatedLinks } from "../../../components/Related";
import AdSlot from "../../../components/AdSlot";
import { templates, getTemplate, resolveRelated } from "../../../content";
import { SITE, ADS, absUrl } from "../../../lib/site";

export const dynamicParams = false;
export function generateStaticParams() {
  return templates.map((t) => ({ slug: t.slug }));
}

export function generateMetadata({ params }) {
  const t = getTemplate(params.slug);
  if (!t) return {};
  const url = `/templates/${t.slug}`;
  return {
    title: t.metaTitle || t.title,
    description: t.description,
    alternates: { canonical: url },
    openGraph: { type: "article", url, title: t.title, description: t.description },
  };
}

export default function TemplatePage({ params }) {
  const t = getTemplate(params.slug);
  if (!t) notFound();
  const rel = resolveRelated(t.related);
  const url = `/templates/${t.slug}`;

  return (
    <Page narrow>
      <Breadcrumbs items={[{ name: "Templates", href: "/templates" }, { name: t.title, href: url }]} />
      <article className="article">
        <header className="art-head">
          <div className="kicker">{t.channel} template</div>
          <h1>{t.title}</h1>
          {t.useCase && <p className="lede"><strong>When to use it:</strong> <Rich text={t.useCase} /></p>}
        </header>

        <div className="prose">
          {t.intro?.map((p, i) => <p key={i}><Rich text={p} /></p>)}

          <h2 id="template">The template</h2>
          <Example label={`${t.channel} template`} text={t.template} />

          {t.placeholders?.length > 0 && (
            <>
              <h2 id="placeholders">How to fill it in</h2>
              <div className="defs">
                {t.placeholders.map((p, i) => (
                  <div key={i} className="def"><div className="def-t mono">{p.key}</div><p><Rich text={p.fill} /></p></div>
                ))}
              </div>
            </>
          )}

          {t.whyItWorks?.length > 0 && (
            <>
              <h2 id="why-it-works">Why it works</h2>
              <ul>{t.whyItWorks.map((w, i) => <li key={i}><Rich text={w} /></li>)}</ul>
            </>
          )}

          <AdSlot slot={ADS.slots.inArticle} layout="in-article" />

          {t.filledExample && (
            <>
              <h2 id="example">Filled-in example</h2>
              <p><Rich text={t.filledExample.context} /></p>
              <Example label="Example" text={t.filledExample.text} />
            </>
          )}

          {t.variations?.length > 0 && (
            <>
              <h2 id="variations">Variations</h2>
              {t.variations.map((v, i) => <Example key={i} label={v.label} text={v.text} />)}
            </>
          )}

          {t.mistakes?.length > 0 && (
            <>
              <h2 id="mistakes">Mistakes to avoid</h2>
              <ul>{t.mistakes.map((m, i) => <li key={i}><Rich text={m} /></li>)}</ul>
            </>
          )}

          {t.followUp && (
            <>
              <h2 id="follow-up">If they don't reply</h2>
              <p><Rich text={t.followUp} /></p>
            </>
          )}
        </div>

        <ToolCta
          title="Get a personalized version for a real company"
          text="FindMyClients finds companies with a current need for your service and drafts a message that references their specific trigger. Free, no signup."
        />
      </article>

      <RelatedLinks rel={rel} />
      <AdSlot slot={ADS.slots.multiplex} format="autorelaxed" />

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: t.title,
          description: t.description,
          dateModified: "2026-10-03",
          mainEntityOfPage: absUrl(url),
          author: { "@type": "Organization", name: SITE.name, url: SITE.url },
          publisher: { "@type": "Organization", name: SITE.name, url: SITE.url },
        }}
      />
    </Page>
  );
}
