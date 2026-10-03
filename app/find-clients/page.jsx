import { Page } from "../../components/SiteChrome";
import { Breadcrumbs, ToolCta } from "../../components/Content";
import { CardGrid } from "../../components/Related";
import AdSlot from "../../components/AdSlot";
import { professions } from "../../content";
import { ADS } from "../../lib/site";

export const metadata = {
  title: "Find clients by profession",
  description:
    "How to find clients for your specific service: who buys it, the buying signals to watch for, where to look and a sample first message for 12 professions.",
  alternates: { canonical: "/find-clients" },
};

export default function ProfessionsIndex() {
  return (
    <Page>
      <Breadcrumbs items={[{ name: "By profession", href: "/find-clients" }]} />
      <header className="page-head">
        <h1>Find clients for <em>what you do.</em></h1>
        <p>Every service has its own buyers and its own tell-tale signs that a company needs help. Pick yours for the client types, buying signals, places to look and a first message that fits.</p>
      </header>
      <CardGrid
        items={professions}
        href={(p) => `/find-clients/${p.slug}`}
        kicker={() => "Find clients"}
        title={(p) => p.name}
        text={(p) => p.description}
      />
      <AdSlot slot={ADS.slots.display} />
      <ToolCta />
    </Page>
  );
}
