import { Page } from "../../components/SiteChrome";
import { Breadcrumbs, ToolCta } from "../../components/Content";
import { CardGrid } from "../../components/Related";
import AdSlot from "../../components/AdSlot";
import { templates } from "../../content";
import { ADS } from "../../lib/site";

export const metadata = {
  title: "Cold outreach templates for freelancers & agencies",
  description:
    "Free cold email, LinkedIn and WhatsApp templates for freelancers and agencies, with fill-in guidance, filled examples, variations and follow-up advice.",
  alternates: { canonical: "/templates" },
};

const CHANNELS = ["Email", "LinkedIn", "WhatsApp"];

export default function TemplatesIndex() {
  return (
    <Page>
      <Breadcrumbs items={[{ name: "Templates", href: "/templates" }]} />
      <header className="page-head">
        <h1>Outreach templates that <em>sound human.</em></h1>
        <p>Short, specific first messages and follow-ups for email, LinkedIn and WhatsApp. Each one explains how to fill it in, why it works and what to send if there's no reply.</p>
      </header>
      {CHANNELS.map((c, i) => {
        const items = templates.filter((t) => t.channel === c);
        if (!items.length) return null;
        return (
          <section key={c} className="idx-sec">
            <h2>{c}</h2>
            <CardGrid items={items} href={(t) => `/templates/${t.slug}`} kicker={(t) => t.channel} title={(t) => t.title} text={(t) => t.useCase} />
            {i === 0 && <AdSlot slot={ADS.slots.display} />}
          </section>
        );
      })}
      <ToolCta />
    </Page>
  );
}
