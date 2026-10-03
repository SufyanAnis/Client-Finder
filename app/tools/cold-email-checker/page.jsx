import { Page } from "../../../components/SiteChrome";
import { Breadcrumbs, Faqs, JsonLd, ToolCta, AnswerBox } from "../../../components/Content";
import EmailChecker from "../../../components/EmailChecker";
import { SITE, absUrl } from "../../../lib/site";

export const metadata = {
  title: "Cold email checker: length, spam words & tone",
  description:
    "Free cold email checker. Paste your email to check length, subject line, links, spam-trigger words, clichés, leftover placeholders, readability and the ask.",
  alternates: { canonical: "/tools/cold-email-checker" },
};

const FAQ = [
  { q: "How long should a cold email be?", a: "Short enough to read on a phone in under a minute — roughly 50 to 125 words for a first email. Lead with a specific observation about the recipient, say how you can help in a sentence or two, and end with one easy question. See [how to write a cold email that gets replies](/guides/cold-email-that-gets-replies)." },
  { q: "Do spam words really matter?", a: "Individual words rarely sink an email on their own — sender reputation and authentication (SPF, DKIM, DMARC) matter more. But promotional phrasing makes an email look like marketing to filters and to people. Plain, specific language is safer and gets more replies. See [cold email deliverability](/blog/cold-email-deliverability)." },
  { q: "Should I put a link in a cold email?", a: "Usually not in the first email. Links and tracking can hurt deliverability for new or low-volume senders, and they ask for a click before you've earned it. Offer to send the portfolio or example if they reply." },
  { q: "Is my email uploaded anywhere?", a: "No. The checker runs entirely in your browser; nothing you paste is sent to our servers." },
];

export default function Page_() {
  return (
    <Page narrow>
      <Breadcrumbs items={[{ name: "Tools", href: "/tools" }, { name: "Cold email checker", href: "/tools/cold-email-checker" }]} />
      <header className="art-head">
        <div className="kicker">Free tool</div>
        <h1>Cold email checker</h1>
      </header>
      <AnswerBox label="What it checks" answer="Paste a cold email to score it on twelve things that affect replies and deliverability: length, subject line, links, spam-trigger phrases, clichés, exclamation marks, all-caps, a clear ask, leftover placeholders, you-versus-I focus, sentence length and reading level. It runs in your browser." />
      <EmailChecker />
      <div className="prose">
        <h2 id="what-good-looks-like">What a good score looks like</h2>
        <p>A score of 80+ means the email is short, plain, about the recipient and ends with an easy question. The checker can't judge the most important thing — whether your opening line is a genuine, specific reason to write to <em>this</em> company. That comes from research: a job post, a launch, a gap you noticed. <a href="/">{SITE.name}</a> finds those signals for you.</p>
        <h2 id="next">Before you hit send</h2>
        <ul>
          <li>Read it out loud. If it sounds like a brochure, rewrite it.</li>
          <li>Check your domain is set up for sending — see <a href="/glossary/spf-record">SPF</a>, <a href="/glossary/dkim">DKIM</a> and <a href="/glossary/dmarc">DMARC</a>.</li>
          <li>Make opting out easy and respect it — see <a href="/guides/cold-outreach-laws">cold outreach laws</a>.</li>
        </ul>
      </div>
      <Faqs faqs={FAQ} />
      <ToolCta title="Find companies worth emailing" />
      <JsonLd data={{
        "@context": "https://schema.org", "@type": "WebApplication", name: "Cold email checker",
        url: absUrl("/tools/cold-email-checker"), applicationCategory: "BusinessApplication", operatingSystem: "Any (web browser)",
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" }, publisher: { "@type": "Organization", name: SITE.name, url: SITE.url },
      }} />
    </Page>
  );
}
