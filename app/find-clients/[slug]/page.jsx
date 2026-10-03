import { notFound } from "next/navigation";
import { Page } from "../../../components/SiteChrome";
import { Breadcrumbs, Faqs, JsonLd, ToolCta, Rich, Example } from "../../../components/Content";
import { RelatedLinks } from "../../../components/Related";
import AdSlot from "../../../components/AdSlot";
import { professions, getProfession, resolveRelated } from "../../../content";
import { SITE, ADS, absUrl } from "../../../lib/site";

export const dynamicParams = false;
export function generateStaticParams() {
  return professions.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }) {
  const p = getProfession(params.slug);
  if (!p) return {};
  const url = `/find-clients/${p.slug}`;
  return {
    title: p.metaTitle || p.title,
    description: p.description,
    alternates: { canonical: url },
    openGraph: { type: "article", url, title: p.title, description: p.description },
  };
}

export default function ProfessionPage({ params }) {
  const p = getProfession(params.slug);
  if (!p) notFound();
  const rel = resolveRelated(p.related);
  const url = `/find-clients/${p.slug}`;
  const preset = p.toolPreset || {};

  return (
    <Page narrow>
      <Breadcrumbs items={[{ name: "By profession", href: "/find-clients" }, { name: p.name, href: url }]} />
      <article className="article">
        <header className="art-head">
          <div className="kicker">Find clients · {p.name}</div>
          <h1>{p.title}</h1>
          {p.intro?.map((t, i) => <p key={i} className={i === 0 ? "lede" : "lede lede-2"}><Rich text={t} /></p>)}
        </header>

        <ToolCta
          title={`Find companies that need a ${p.singular} now`}
          text={`Prefilled for ${p.name.toLowerCase()}${preset.niche ? ` targeting ${preset.niche}` : ""} — change the location and niche, then run a free search.`}
          service={preset.service}
          niche={preset.niche}
        />

        <div className="prose">
          <section>
            <h2 id="best-clients">Clients who buy from {p.name.toLowerCase()}</h2>
            <div className="defs">
              {p.bestClients?.map((c, i) => (
                <div key={i} className="def"><div className="def-t">{c.type}</div><p><Rich text={c.why} /></p></div>
              ))}
            </div>
          </section>

          <section>
            <h2 id="buying-signals">Buying signals to look for</h2>
            <p>These are observable signs that a company needs a {p.singular} soon — the kind of trigger worth mentioning in your first line.</p>
            <div className="defs">
              {p.buyingSignals?.map((s, i) => (
                <div key={i} className="def"><div className="def-t">{s.signal}</div><p><Rich text={s.howToSpot} /></p></div>
              ))}
            </div>
          </section>

          <AdSlot slot={ADS.slots.inArticle} layout="in-article" />

          <section>
            <h2 id="where-to-look">Where to look</h2>
            <div className="defs">
              {p.whereToLook?.map((w, i) => (
                <div key={i} className="def"><div className="def-t">{w.place}</div><p><Rich text={w.how} /></p></div>
              ))}
            </div>
          </section>

          {p.pitchAngles?.length > 0 && (
            <section>
              <h2 id="pitch-angles">Pitch angles that work</h2>
              <ul>{p.pitchAngles.map((t, i) => <li key={i}><Rich text={t} /></li>)}</ul>
            </section>
          )}

          {p.sampleMessage && (
            <section>
              <h2 id="sample-message">Sample first message</h2>
              <Example label={`${p.sampleMessage.channel || "Email"} — ${p.singular}`} text={p.sampleMessage.text} />
            </section>
          )}

          {p.pricingNote && (
            <section>
              <h2 id="pricing">Talking about price</h2>
              <p><Rich text={p.pricingNote} /></p>
            </section>
          )}

          {p.mistakes?.length > 0 && (
            <section>
              <h2 id="mistakes">Mistakes to avoid</h2>
              <ul>{p.mistakes.map((t, i) => <li key={i}><Rich text={t} /></li>)}</ul>
            </section>
          )}
        </div>

        <Faqs faqs={p.faqs} />
      </article>

      <RelatedLinks rel={rel} />
      <AdSlot slot={ADS.slots.multiplex} format="autorelaxed" />

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: p.title,
          description: p.description,
          dateModified: "2026-10-03",
          mainEntityOfPage: absUrl(url),
          author: { "@type": "Organization", name: SITE.name, url: SITE.url },
          publisher: { "@type": "Organization", name: SITE.name, url: SITE.url },
        }}
      />
    </Page>
  );
}
