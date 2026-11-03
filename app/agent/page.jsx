import { Page } from "../../components/SiteChrome";
import Agent from "../../components/Agent";

export const metadata = { title: "Outreach agent", robots: { index: false, follow: false } };

// Owner-only (middleware). The agent researches leads, drafts messages, sends the
// ones you approve from your Gmail, and tracks replies and follow-ups.
export default function AgentPage() {
  return (
    <Page>
      <header className="page-head">
        <h1>Outreach <em>agent.</em></h1>
        <p>Research → draft → you approve → sent from your Gmail → replies read and sorted → follow-ups drafted. Nothing goes out without your click.</p>
      </header>
      <Agent />
    </Page>
  );
}
