import Link from "next/link";
import LeadApp from "../components/LeadApp";
import { Page } from "../components/SiteChrome";
import { Faqs, JsonLd } from "../components/Content";
import { CardGrid } from "../components/Related";
import AdSlot from "../components/AdSlot";
import { guides, professions, templates, blog } from "../content";
import { SITE, ADS } from "../lib/site";

export const metadata = {
  alternates: { canonical: "/" },
  openGraph: { url: "/" },
};

const FAQ = [
  {
    q: "Is FindMyClients really free?",
    a: "Yes. Anyone can run a few searches a day with no signup, plus a handful of message drafts and contact lookups. The limits exist because every search runs live web research, which costs money; they reset at midnight UTC. The site is supported by ads on the guide and template pages.",
  },
  {
    q: "Where do the leads come from?",
    a: "Each search runs a live web search aimed at demand signals — job posts for the role you cover, companies asking for an agency or freelancer, launches and funding news — and an AI model picks out the real companies behind those results. Job boards and marketplaces are excluded, so you get the actual company, not the listing.",
  },
  {
    q: "Are the contact details accurate?",
    a: "They're public company details only — a generic email like hello@, a main phone number or a company LinkedIn page — and only when they appear on the web. Often there isn't one, and the cells stay editable so you can add what you find. Always check a lead before contacting it; AI research can be wrong or out of date.",
  },
  {
    q: "Does it send emails for me?",
    a: "No. FindMyClients finds companies and drafts a first message; you review, edit and send it yourself from your own email, LinkedIn or WhatsApp. That keeps outreach personal and keeps you in control of volume, which matters for deliverability and for outreach law. See the [guide to cold outreach laws](/guides/cold-outreach-laws).",
  },
  {
    q: "Where is my pipeline stored?",
    a: "In your own browser (localStorage). Nothing you save is uploaded to our servers, so it won't follow you to another device — use Export to Excel to keep a permanent copy. The targeting you search with is sent to our AI and search providers to run the search.",
  },
  {
    q: "Who is it for?",
    a: "Freelancers and small agencies selling a service to businesses: developers, designers, SEO and marketing people, writers, video editors, bookkeepers, automation consultants and similar. If you sell to companies and want a short list of ones that need you right now, it's for you. Start with [find clients by profession](/find-clients).",
  },
];

export default function Home() {
  const featuredGuides = guides.slice(0, 6);
  const latestPosts = blog.slice(0, 6);
  return (
    <Page>
      <header className="hero">
        <div className="pill"><span className="dot" /> Free · no signup · live web research</div>
        <h1>Find clients who need you <em>right now.</em></h1>
        <p>
          Tell it what you sell and who you want to work with. {SITE.name} searches the live web for real companies
          showing a current need — hiring for your skill, launching, growing, or visibly struggling with what you fix —
          scores each one, and drafts a first message you can send in minutes.
        </p>
      </header>

      <LeadApp />

      <section className="home-sec">
        <h2>How it works</h2>
        <div className="steps">
          <div className="step"><span className="step-n">1</span><div className="step-t">Describe your service</div><p>Pick a preset or type your own service, where your clients are and, optionally, a niche and company size.</p></div>
          <div className="step"><span className="step-n">2</span><div className="step-t">Get companies with a reason to buy</div><p>Each lead comes with a fit score, a one-line reason it fits, and the "why now" signal — with a link to the source.</p></div>
          <div className="step"><span className="step-n">3</span><div className="step-t">Draft, save, export</div><p>Draft an email, LinkedIn or WhatsApp message that references the signal, save leads to your pipeline and export to Excel.</p></div>
        </div>
      </section>

      <AdSlot slot={ADS.slots.display} />

      <section className="home-sec">
        <div className="sec-head">
          <h2>Find clients by profession</h2>
          <Link href="/find-clients" className="more">All professions →</Link>
        </div>
        <div className="pills">
          {professions.map((p) => <Link key={p.slug} href={`/find-clients/${p.slug}`} className="tagpill">{p.name}</Link>)}
        </div>
      </section>

      {latestPosts.length > 0 && (
        <section className="home-sec">
          <div className="sec-head">
            <h2>From the blog</h2>
            <Link href="/blog" className="more">All posts →</Link>
          </div>
          <CardGrid items={latestPosts} href={(p) => `/blog/${p.slug}`} kicker={(p) => p.category} title={(p) => p.title} text={(p) => p.excerpt} />
        </section>
      )}

      <section className="home-sec">
        <div className="sec-head">
          <h2>Free tools</h2>
          <Link href="/tools" className="more">All tools →</Link>
        </div>
        <div className="cards">
          <Link href="/tools/freelance-rate-calculator" className="ccard"><div className="kicker">Free tool</div><div className="ccard-t">Freelance rate calculator</div><p>Your minimum hourly and day rate after expenses, tax and non-billable time.</p></Link>
          <Link href="/tools/cold-email-checker" className="ccard"><div className="kicker">Free tool</div><div className="ccard-t">Cold email checker</div><p>Score an email on length, spam triggers, clichés, links and the ask.</p></Link>
          <Link href="/glossary" className="ccard"><div className="kicker">Reference</div><div className="ccard-t">Outreach glossary</div><p>Buying signals, ICPs, DMARC, PECR and more — explained in plain English.</p></Link>
        </div>
      </section>

      <section className="home-sec">
        <div className="sec-head">
          <h2>Guides</h2>
          <Link href="/guides" className="more">All guides →</Link>
        </div>
        <CardGrid items={featuredGuides} href={(g) => `/guides/${g.slug}`} kicker={(g) => g.category} title={(g) => g.title} text={(g) => g.excerpt} />
      </section>

      <section className="home-sec">
        <div className="sec-head">
          <h2>Outreach templates</h2>
          <Link href="/templates" className="more">All templates →</Link>
        </div>
        <div className="pills">
          {templates.map((t) => <Link key={t.slug} href={`/templates/${t.slug}`} className="tagpill">{t.title.replace(/^(Cold email template|Template):\s*/i, "")}</Link>)}
        </div>
      </section>

      <Faqs faqs={FAQ} />

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "WebApplication",
              name: SITE.name,
              url: SITE.url,
              description: SITE.description,
              applicationCategory: "BusinessApplication",
              operatingSystem: "Any (web browser)",
              offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
            },
            { "@type": "WebSite", name: SITE.name, url: SITE.url },
            { "@type": "Organization", name: SITE.name, url: SITE.url, logo: SITE.url + "/icon.svg" },
          ],
        }}
      />
    </Page>
  );
}
