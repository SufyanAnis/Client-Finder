import { Page } from "../../../components/SiteChrome";
import { Breadcrumbs, Faqs, JsonLd, ToolCta, AnswerBox } from "../../../components/Content";
import WebsiteExtractor from "../../../components/WebsiteExtractor";
import { SITE, absUrl } from "../../../lib/site";

export const metadata = {
  title: "Website contact extractor: emails, phones & socials",
  description:
    "Paste business websites and get their public email, phone, WhatsApp and social links, what they do, their team and website issues to pitch on. CSV export.",
  alternates: { canonical: "/tools/website-extractor" },
};

const FAQ = [
  { q: "How does the website extractor find emails and phone numbers?", a: "It reads the homepage plus up to three linked contact, about or team pages, then copies contact details exactly as published — email and phone links, numbers in international format, the site's structured business data, and links to its social profiles. Nothing is guessed: if a site doesn't publish an email, none is shown." },
  { q: "What are the 'pitch angles'?", a: "Signs a business may need web work: no HTTPS, no mobile viewport, an old copyright year, no meta description, no contact form, or a page builder in use. They're starting points for a specific, useful first message — see [cold email that gets replies](/guides/cold-email-that-gets-replies)." },
  { q: "Can I extract other information?", a: "Yes. Choose Custom and describe what you want — for example opening hours, prices or the services offered. The AI only uses text that appears on the site and leaves fields empty when the information isn't there." },
  { q: "Is it legal to use the contact details?", a: "The tool only reads publicly published business pages. How you contact people is up to you and the rules where you and they are — keep it personal, relevant and easy to opt out of. See the [cold outreach laws guide](/guides/cold-outreach-laws). This is not legal advice." },
];

export default function Page_() {
  return (
    <Page narrow>
      <Breadcrumbs items={[{ name: "Tools", href: "/tools" }, { name: "Website extractor", href: "/tools/website-extractor" }]} />
      <header className="art-head">
        <div className="kicker">Free tool</div>
        <h1>Website contact extractor</h1>
      </header>
      <AnswerBox label="What it does" answer="Paste up to 10 business websites. For each one, the extractor reads the homepage and its contact, about and team pages, then returns the public email, phone, WhatsApp and social links, what the business does, named team members, and website issues you can pitch on — ready to export or save to your pipeline." />
      <WebsiteExtractor />
      <Faqs faqs={FAQ} />
      <ToolCta title="Need websites to check? Find companies first" />
      <JsonLd data={{
        "@context": "https://schema.org", "@type": "WebApplication", name: "Website contact extractor",
        url: absUrl("/tools/website-extractor"), applicationCategory: "BusinessApplication", operatingSystem: "Any (web browser)",
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" }, publisher: { "@type": "Organization", name: SITE.name, url: SITE.url },
      }} />
    </Page>
  );
}
