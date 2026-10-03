import Link from "next/link";
import { Page } from "../../components/SiteChrome";
import { Breadcrumbs, JsonLd, Rich, plainText } from "../../components/Content";
import { glossary } from "../../content";
import { SITE, absUrl } from "../../lib/site";

export const metadata = {
  title: "Client outreach glossary: sales & cold email terms explained",
  description:
    "Plain-English definitions of the sales, prospecting and cold email terms freelancers and agencies run into — from buying signals and ICPs to DMARC and PECR.",
  alternates: { canonical: "/glossary" },
};

export default function GlossaryIndex() {
  const sorted = [...glossary].sort((a, b) => a.term.localeCompare(b.term));
  const letters = [...new Set(sorted.map((t) => t.term[0].toUpperCase()))];
  return (
    <Page narrow>
      <Breadcrumbs items={[{ name: "Glossary", href: "/glossary" }]} />
      <header className="page-head">
        <h1>Outreach <em>glossary.</em></h1>
        <p>The prospecting, sales and email terms you'll meet while finding clients, explained in a sentence — then in enough depth to use.</p>
      </header>
      <nav className="pills" aria-label="Jump to letter" style={{ margin: "8px 0 24px" }}>
        {letters.map((l) => <a key={l} href={`#letter-${l}`} className="tagpill">{l}</a>)}
      </nav>
      <div className="gloss">
        {letters.map((l) => (
          <section key={l} id={`letter-${l}`}>
            <h2>{l}</h2>
            <dl>
              {sorted.filter((t) => t.term[0].toUpperCase() === l).map((t) => (
                <div key={t.slug} className="gloss-row">
                  <dt><Link href={`/glossary/${t.slug}`}>{t.term}</Link></dt>
                  <dd><Rich text={t.short} /></dd>
                </div>
              ))}
            </dl>
          </section>
        ))}
      </div>
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "DefinedTermSet",
        name: `${SITE.name} glossary`,
        url: absUrl("/glossary"),
        hasDefinedTerm: sorted.map((t) => ({ "@type": "DefinedTerm", name: t.term, description: plainText(t.short), url: absUrl(`/glossary/${t.slug}`) })),
      }} />
    </Page>
  );
}
