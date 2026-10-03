import Link from "next/link";
import { Page } from "../../components/SiteChrome";
import { Breadcrumbs } from "../../components/Content";
import { SITE } from "../../lib/site";

export const metadata = {
  title: "Terms of use",
  description: `The terms for using ${SITE.name}: acceptable use, AI-generated results, your responsibility for outreach, limits and disclaimers.`,
  alternates: { canonical: "/terms" },
};

export default function Terms() {
  return (
    <Page narrow>
      <Breadcrumbs items={[{ name: "Terms of use", href: "/terms" }]} />
      <article className="article">
        <header className="art-head">
          <h1>Terms of use</h1>
          <div className="art-meta">Last updated October 3, 2026</div>
        </header>
        <div className="prose">
          <p>
            By using {SITE.name} (the "site"), operated by {SITE.operator}, you agree to these terms. If you don't agree, please
            don't use the site.
          </p>

          <h2>What the service is</h2>
          <p>
            {SITE.name} helps you research companies that may need your services and drafts outreach messages for you to review.
            It does not send messages on your behalf. The guides and templates are general information, not professional, legal or
            financial advice.
          </p>

          <h2>AI-generated results</h2>
          <p>
            Search results, fit scores, signals, contact details and drafts are generated automatically from public web sources and
            AI models. They can be incomplete, outdated or wrong. Check any information before relying on it or contacting anyone.
          </p>

          <h2>Your responsibilities</h2>
          <ul>
            <li>
              You are responsible for any outreach you send, including complying with anti-spam, privacy and marketing laws that apply
              to you and your recipients (for example CAN-SPAM, GDPR/UK GDPR and PECR, or CASL). Our{" "}
              <Link href="/guides/cold-outreach-laws">outreach laws guide</Link> is a starting point, not legal advice.
            </li>
            <li>Respect opt-outs and keep outreach personal and proportionate. Don't use the site for bulk unsolicited messaging.</li>
            <li>Don't use the site to harass anyone, to collect personal data about private individuals, or for anything unlawful.</li>
          </ul>

          <h2>Acceptable use</h2>
          <p>
            Don't try to bypass usage limits or bot protection, access the site's APIs with automated scripts, resell results as a
            data product, overload the service, or interfere with its security. We may block access that breaks these rules.
          </p>

          <h2>Free search, credits and payments</h2>
          <p>
            Each visitor gets one free search. Further searches use prepaid credits bought in packs through our payment
            processor, Safepay; prices are shown on the <Link href="/pricing">pricing page</Link> in Pakistani rupees. One credit
            is one search. Credits are tied to a license key, don't expire and can't be exchanged for cash except under the{" "}
            <Link href="/refund-policy">refund policy</Link>. Keep your key private — anyone with it can use its credits.
            Drafts and contact lookups are included within reasonable daily limits.
          </p>
          <h2>Availability</h2>
          <p>
            The service may occasionally be unavailable, rate-limited or changed, and features may be added or removed. A
            search that fails is not charged.
          </p>

          <h2>Content and intellectual property</h2>
          <p>
            You may use the drafts and templates in your own outreach. The site's design, code, guides and other content remain ours;
            please don't republish the guides wholesale without permission. Third-party names and trademarks belong to their owners.
          </p>

          <h2>Disclaimers and liability</h2>
          <p>
            The site is provided "as is" and "as available", without warranties of any kind. To the fullest extent permitted by law,
            {" "}{SITE.operator} is not liable for any indirect or consequential loss, lost business or lost profits arising from your
            use of the site, and our total liability for any claim is limited to the amount you paid us to use the site (which, for
            free use, is zero). Nothing in these terms limits liability that cannot be limited by law.
          </p>

          <h2>Third-party links and ads</h2>
          <p>The site links to and displays ads from third parties. We're not responsible for their content, products or policies.</p>

          <h2>Changes and law</h2>
          <p>
            We may update these terms; continued use after an update means you accept it. These terms are governed by the laws of
            Pakistan, without prejudice to mandatory consumer protections where you live.
          </p>

          <h2>Contact</h2>
          <p>Questions about these terms: use the <Link href="/contact">contact page</Link>.</p>
        </div>
      </article>
    </Page>
  );
}
