import { notFound } from "next/navigation";
import { Page } from "../../../components/SiteChrome";
import { Breadcrumbs, JsonLd } from "../../../components/Content";
import { CardGrid } from "../../../components/Related";
import { AUTHORS } from "../../../lib/authors";
import { blog, guides } from "../../../content";
import { personLd } from "../../../lib/schema";

export const dynamicParams = false;
export function generateStaticParams() {
  return Object.keys(AUTHORS).map((slug) => ({ slug }));
}

export function generateMetadata({ params }) {
  const a = AUTHORS[params.slug];
  if (!a) return {};
  return { title: `${a.name} — ${a.role}`, description: a.bio.slice(0, 155), alternates: { canonical: `/authors/${a.slug}` } };
}

export default function AuthorPage({ params }) {
  const a = AUTHORS[params.slug];
  if (!a) notFound();
  return (
    <Page narrow>
      <Breadcrumbs items={[{ name: "About", href: "/about" }, { name: a.name, href: `/authors/${a.slug}` }]} />
      <header className="page-head">
        <h1>{a.name}</h1>
        <p className="kicker" style={{ marginTop: 10 }}>{a.role}</p>
        <p>{a.bio}</p>
        <div className="pills" style={{ marginTop: 16 }}>
          {a.links.map((l) => <a key={l.url} href={l.url} className="tagpill" target="_blank" rel="noopener me">{l.label}</a>)}
        </div>
      </header>
      <section className="idx-sec">
        <h2>Articles</h2>
        <CardGrid items={[...blog, ...guides]} href={(x) => (blog.includes(x) ? `/blog/${x.slug}` : `/guides/${x.slug}`)} kicker={(x) => x.category} title={(x) => x.title} />
      </section>
      <JsonLd data={{ "@context": "https://schema.org", "@type": "ProfilePage", mainEntity: personLd(a) }} />
    </Page>
  );
}
