import Link from "next/link";
import { Page } from "../../components/SiteChrome";
import { Breadcrumbs } from "../../components/Content";
import { SITE } from "../../lib/site";

export const metadata = {
  title: "Refund policy",
  description: `${SITE.name} refund policy for search credit packs: unused credits refundable within 14 days, automatic credit refunds for failed searches.`,
  alternates: { canonical: "/refund-policy" },
};

export default function RefundPolicy() {
  return (
    <Page narrow>
      <Breadcrumbs items={[{ name: "Refund policy", href: "/refund-policy" }]} />
      <article className="article">
        <header className="art-head">
          <h1>Refund policy</h1>
          <div className="art-meta">Last updated October 4, 2026</div>
        </header>
        <div className="prose">
          <p>{SITE.name} sells one-time credit packs for its lead finder. Payments are processed by Safepay. This policy explains when you can get your money back.</p>
          <h2>Failed searches are refunded automatically</h2>
          <p>If a search fails or returns no usable leads, the credit is returned to your license key immediately. You don't need to ask.</p>
          <h2>Unused credits: 14 days</h2>
          <p>You can request a full refund for a credit pack within 14 days of purchase if you haven't used any of its credits, or a pro-rata refund for the unused credits if you've used some. Contact us through the <Link href="/contact">contact page</Link> with your license key or Safepay receipt.</p>
          <h2>After 14 days</h2>
          <p>Credits never expire, so we don't normally refund packs after 14 days. If something went wrong on our side — for example you were charged twice or never received your key — contact us and we'll fix it regardless of timing.</p>
          <h2>How refunds are paid</h2>
          <p>Approved refunds go back to the original payment method through Safepay. Timing depends on your bank or wallet provider. Refunded credits are removed from the key.</p>
          <h2>Results</h2>
          <p>Leads are AI research from public web sources and can be incomplete or out of date. We don't refund because a particular lead didn't become a client, but tell us if results are consistently poor for your niche and we'll look into it.</p>
          <h2>Contact</h2>
          <p>{SITE.name} is operated by {SITE.operator}, {SITE.operatorLocation}. Use the <Link href="/contact">contact page</Link> for any payment question.</p>
        </div>
      </article>
    </Page>
  );
}
