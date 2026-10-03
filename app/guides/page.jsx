import { Page } from "../../components/SiteChrome";
import { Breadcrumbs, ToolCta } from "../../components/Content";
import { CardGrid } from "../../components/Related";
import AdSlot from "../../components/AdSlot";
import { guides } from "../../content";
import { ADS } from "../../lib/site";

export const metadata = {
  title: "Guides: how to find and win clients as a freelancer",
  description:
    "Practical guides for freelancers and agencies: finding clients, cold email, LinkedIn and WhatsApp outreach, buying signals, follow-ups and outreach law.",
  alternates: { canonical: "/guides" },
};

const ORDER = ["Prospecting", "Outreach", "Strategy", "Compliance"];

export default function GuidesIndex() {
  const cats = ORDER.filter((c) => guides.some((g) => g.category === c));
  const other = guides.filter((g) => !ORDER.includes(g.category));
  return (
    <Page>
      <Breadcrumbs items={[{ name: "Guides", href: "/guides" }]} />
      <header className="page-head">
        <h1>Guides for winning <em>clients.</em></h1>
        <p>How to find companies that need what you sell, reach them without sounding like spam, and turn replies into projects. Written for freelancers and small agencies.</p>
      </header>
      {cats.map((c, i) => (
        <section key={c} className="idx-sec">
          <h2>{c}</h2>
          <CardGrid
            items={guides.filter((g) => g.category === c)}
            href={(g) => `/guides/${g.slug}`}
            kicker={(g) => `${g.readingMinutes} min read`}
            title={(g) => g.title}
            text={(g) => g.excerpt}
          />
          {i === 0 && <AdSlot slot={ADS.slots.display} />}
        </section>
      ))}
      {other.length > 0 && (
        <section className="idx-sec">
          <h2>More</h2>
          <CardGrid items={other} href={(g) => `/guides/${g.slug}`} title={(g) => g.title} text={(g) => g.excerpt} />
        </section>
      )}
      <ToolCta />
    </Page>
  );
}
