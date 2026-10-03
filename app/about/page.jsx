import Link from "next/link";
import { Page } from "../../components/SiteChrome";
import { Breadcrumbs, ToolCta } from "../../components/Content";
import { SITE } from "../../lib/site";

export const metadata = {
  title: "About",
  description: `Why ${SITE.name} exists, how the lead finder works, what it will and won't do, and who builds it.`,
  alternates: { canonical: "/about" },
};

export default function About() {
  return (
    <Page narrow>
      <Breadcrumbs items={[{ name: "About", href: "/about" }]} />
      <article className="article">
        <header className="art-head">
          <h1>About {SITE.name}</h1>
          <p className="lede">A free lead finder for freelancers and small agencies, built by people who needed it first.</p>
        </header>
        <div className="prose">
          <h2>Why it exists</h2>
          <p>
            {SITE.name} started as an internal tool at {SITE.operator}, a small digital studio in {SITE.operatorLocation}. Like most
            small studios, we didn't struggle to do the work — we struggled to find the next client without spending whole days
            scrolling job boards and company websites. So we built a tool that does the first pass: find companies that show a
            real, current need for a service, explain why, and draft a first message we could edit and send.
          </p>
          <p>
            It worked well enough that we opened it up. Freelancers and small agencies face the same problem everywhere, and most
            lead-generation software is priced and designed for sales teams, not for one person with a laptop.
          </p>

          <h2>How it works</h2>
          <p>
            When you run a search, the server runs a live web search aimed at <strong>demand signals</strong> for your service —
            job posts for the role you cover, companies asking for an agency or freelancer, launches, funding and expansion news.
            An AI model reads those results, picks out the real companies behind them (not job boards or marketplaces), scores each
            one for fit and writes down the specific reason to contact them now, with a link to where it came from.
          </p>
          <p>
            Drafts are written in your voice from the "About you" details you give. They are told never to invent clients, results
            or prices you didn't mention.
          </p>

          <h2>What it won't do</h2>
          <ul>
            <li><strong>It doesn't send anything.</strong> You review and send every message yourself. That keeps outreach personal and within the law.</li>
            <li><strong>It doesn't scrape behind logins</strong> or collect personal data. Contact details are public company details only — a generic email, a main phone number, a company LinkedIn page.</li>
            <li><strong>It doesn't pretend to be perfect.</strong> AI research can be wrong or out of date. Check every lead before you reach out.</li>
          </ul>

          <h2>Why it's free, and why there are limits</h2>
          <p>
            Every search costs us real money in web-search and AI usage, so free use has a daily limit per visitor and the site as
            a whole has a daily budget. The guides and templates are supported by ads. If you hit the limit, the
            <Link href="/guides"> guides</Link> and <Link href="/templates">templates</Link> are always available — they're the
            method behind the tool, and you can use them with nothing but a spreadsheet.
          </p>

          <h2>How we write the guides</h2>
          <p>
            The guides come from doing client outreach ourselves. We avoid made-up statistics: where a number appears, it's a rule
            of thumb, and we say so. Legal pages explain the main rules in plain language but are not legal advice. If you spot
            something wrong or out of date, <Link href="/contact">tell us</Link> and we'll fix it.
          </p>

          <h2>Who's behind it</h2>
          <p>
            {SITE.name} is built and run by <a href={SITE.operatorUrl} target="_blank" rel="noopener">{SITE.operator}</a>, a small
            studio building web, mobile and AI products. Questions, feedback or a removal request for a company listed in results:
            use the <Link href="/contact">contact page</Link>.
          </p>
        </div>
        <ToolCta />
      </article>
    </Page>
  );
}
