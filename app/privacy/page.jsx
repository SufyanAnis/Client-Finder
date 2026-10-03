import Link from "next/link";
import { Page } from "../../components/SiteChrome";
import { Breadcrumbs } from "../../components/Content";
import { SITE } from "../../lib/site";

export const metadata = {
  title: "Privacy policy",
  description: `How ${SITE.name} handles data: what we collect, what stays in your browser, advertising cookies from Google AdSense, and your choices.`,
  alternates: { canonical: "/privacy" },
};

const UPDATED = "October 3, 2026";

export default function Privacy() {
  return (
    <Page narrow>
      <Breadcrumbs items={[{ name: "Privacy policy", href: "/privacy" }]} />
      <article className="article">
        <header className="art-head">
          <h1>Privacy policy</h1>
          <div className="art-meta">Last updated {UPDATED}</div>
        </header>
        <div className="prose">
          <p>
            This policy explains what information {SITE.name} ("we", "us"), operated by {SITE.operator} in {SITE.operatorLocation},
            handles when you use {SITE.url.replace(/^https?:\/\//, "")} (the "site"). We try to collect as little as possible.
          </p>

          <h2>Information you give us</h2>
          <ul>
            <li>
              <strong>Search inputs.</strong> When you run a search, the targeting you enter (service, location, niche, company
              size, number of leads) is sent to our server and to the providers listed below to perform the search. We may keep
              the targeting and the resulting company list in a short-lived cache (up to 12 hours) so identical searches don't
              cost twice. It is not linked to your name or account — there are no visitor accounts.
            </li>
            <li>
              <strong>"About you" details.</strong> If you fill in your name, business and offer, they are stored in your browser
              and sent with a draft request so the AI can write in your voice. We don't store them on our servers.
            </li>
            <li>
              <strong>Contact form.</strong> If you contact us, we receive your name, email, topic and message by email (via the
              Web3Forms service) and may store them in our database (Supabase) so we can reply. We keep messages only as long as
              needed to handle them.
            </li>
          </ul>

          <h2>Information stored only in your browser</h2>
          <p>
            Your saved pipeline, your "About you" details and small preferences are kept in your browser's local storage. They are
            never uploaded to us, don't follow you to other devices, and are deleted if you clear your browser's site data.
          </p>

          <h2>Information collected automatically</h2>
          <ul>
            <li>
              <strong>Usage limits.</strong> To enforce daily free limits, we derive a one-way, salted hash from your IP address
              and count requests against it. We don't store the raw IP address for this purpose, and the counters expire after
              about two days.
            </li>
            <li>
              <strong>Server logs.</strong> Our host, Vercel, processes standard request logs (such as IP address, browser type and
              requested page) to run and secure the service.
            </li>
            <li>
              <strong>Bot protection.</strong> If enabled, Cloudflare Turnstile may process browser and device signals to check that
              a search is made by a person.
            </li>
          </ul>

          <h2>Advertising and cookies</h2>
          <p>
            We use <strong>Google AdSense</strong> to show ads. Third-party vendors, including Google, use cookies to serve ads based
            on your prior visits to this site or other websites. Google's use of advertising cookies enables it and its partners to
            serve ads to you based on your visits to this and/or other sites on the internet.
          </p>
          <ul>
            <li>
              You can opt out of personalized advertising in Google's{" "}
              <a href="https://adssettings.google.com" target="_blank" rel="noopener">Ads Settings</a>. You can also opt out of some
              third-party vendors' use of cookies for personalized advertising at{" "}
              <a href="https://www.aboutads.info/choices/" target="_blank" rel="noopener">aboutads.info</a>.
            </li>
            <li>
              Learn{" "}
              <a href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noopener">
                how Google uses information from sites or apps that use its services
              </a>.
            </li>
            <li>
              Visitors in the European Economic Area, the UK and Switzerland are asked for consent through a Google-certified consent
              message before personalized ads or advertising cookies are used, and can change that choice at any time from the
              privacy link it provides.
            </li>
          </ul>
          <p>
            Apart from advertising, we don't set tracking cookies for visitors. The only first-party cookie is a sign-in cookie used
            by the site owner's admin login.
          </p>

          <h2>Service providers</h2>
          <p>We share the minimum data needed with these providers, who process it on our behalf:</p>
          <ul>
            <li><strong>Vercel</strong> — hosting.</li>
            <li><strong>Groq</strong> (and, if configured, other AI providers such as Anthropic) — AI processing of search results and drafts.</li>
            <li><strong>Tavily</strong> — web search.</li>
            <li><strong>Upstash</strong> — usage counters, the short-lived search cache, and credit balances (stored against a one-way hash of your license key).</li>
            <li><strong>Safepay</strong> — payment processing. Your card or wallet details are entered on Safepay's checkout and never reach our servers; we receive confirmation that an order was paid.</li>
            <li><strong>Web3Forms</strong> and <strong>Supabase</strong> — delivering and storing contact-form messages.</li>
            <li><strong>Google AdSense</strong> — advertising. <strong>Cloudflare</strong> — bot protection, if enabled.</li>
          </ul>
          <p>Some of these providers are located outside your country, including in the United States.</p>

          <h2>Information about companies in results</h2>
          <p>
            Search results contain business information that is already public on the web, such as a company name, website, location
            and a generic contact address. If you represent a company and want it excluded or corrected, use the{" "}
            <Link href="/contact">contact page</Link> and choose "Remove a company from results".
          </p>

          <h2>Your rights</h2>
          <p>
            Depending on where you live (for example under the GDPR or UK GDPR), you may have the right to access, correct or delete
            personal data we hold about you, to object to or restrict processing, and to complain to your data protection authority.
            Because we hold very little, most requests can be handled quickly — <Link href="/contact">contact us</Link>.
          </p>

          <h2>Children</h2>
          <p>The site is a business tool and isn't directed at children under 16. We don't knowingly collect their data.</p>

          <h2>Changes</h2>
          <p>We'll update this page if our practices change and revise the date at the top.</p>

          <h2>Contact</h2>
          <p>
            Questions about this policy: use the <Link href="/contact">contact page</Link>
            {SITE.contactEmail ? <> or email <a href={"mailto:" + SITE.contactEmail}>{SITE.contactEmail}</a></> : null}.
          </p>
        </div>
      </article>
    </Page>
  );
}
