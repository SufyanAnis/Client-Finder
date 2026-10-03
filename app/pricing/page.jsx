import Link from "next/link";
import { Page } from "../../components/SiteChrome";
import { Breadcrumbs, Faqs, JsonLd } from "../../components/Content";
import { Packs, KeyEntry } from "../../components/Paywall";
import { PACKS, CURRENCY } from "../../lib/plans";
import { SITE, absUrl } from "../../lib/site";
import { paywallEnabled } from "../../lib/credits";

export const metadata = {
  title: "Pricing — credit packs from Rs 499",
  description: `Your first ${SITE.name} search is free. After that, buy a credit pack — one credit is one search with up to 5 researched leads, drafts and contact lookups.`,
  alternates: { canonical: "/pricing" },
};

const FAQ = [
  { q: "What do I get for one credit?", a: "One lead search: up to 5 companies with a current reason to need your service, each with a fit score, the 'why now' signal and its source. Drafted outreach messages and public contact lookups for those leads are included, within generous daily limits." },
  { q: "Do credits expire?", a: "No. Credits stay on your license key until you use them." },
  { q: "How do I get my credits after paying?", a: "Straight after checkout you're shown a license key (FMC-XXXX-XXXX-XXXX-XXXX). It's saved in your browser automatically. Copy it somewhere safe — you can paste it on another device or browser to use the same credits." },
  { q: "What if a search fails?", a: "You're not charged. If the search errors or returns nothing usable, the credit goes straight back to your key." },
  { q: "Which payment methods can I use?", a: "Checkout is handled by Safepay, a Pakistani payment gateway. It supports debit and credit cards, and wallets like Easypaisa and JazzCash where available. Prices are in Pakistani rupees; card issuers outside Pakistan convert the amount." },
  { q: "Can I get a refund?", a: "Unused credits can be refunded within 14 days of purchase. See the [refund policy](/refund-policy) for details." },
];

export default function Pricing({ searchParams }) {
  const cancelled = searchParams?.cancelled;
  return (
    <Page>
      <Breadcrumbs items={[{ name: "Pricing", href: "/pricing" }]} />
      <header className="page-head">
        <h1>Simple <em>pricing.</em></h1>
        <p>Your first search is free, no signup. After that, buy credits once and use them whenever you like — no subscription, credits never expire.</p>
      </header>
      {!paywallEnabled() && <div className="answer" style={{ marginBottom: 18 }}><div className="label">Launching soon</div><p>Credit packs open shortly. Until then, searches are free within a daily limit — <a href="/#finder">try it now</a>.</p></div>}
      {cancelled && <div className="errbox" style={{ marginBottom: 18 }}>Checkout was cancelled — you haven't been charged.</div>}
      <Packs />
      <div style={{ maxWidth: 560, marginTop: 26 }}><KeyEntry /></div>
      <section className="home-sec">
        <h2>What every search includes</h2>
        <div className="steps">
          <div className="step"><div className="step-t">Up to 5 researched leads</div><p>Real companies with a current demand signal — hiring for your skill, funding, launches, new openings — with a link to the source.</p></div>
          <div className="step"><div className="step-t">Fit score and "why now"</div><p>Each lead scored 0–100 against your service and target, with a one-line reason to contact them now.</p></div>
          <div className="step"><div className="step-t">Drafts, contacts, export</div><p>Email, LinkedIn or WhatsApp drafts in your voice, public contact lookups, and Excel export of your pipeline.</p></div>
        </div>
      </section>
      <Faqs faqs={FAQ} />
      <p className="fine">Questions about a payment? <Link href="/contact">Contact us</Link> with your order details. The guides, templates and free tools stay free for everyone.</p>
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "Product",
        name: `${SITE.name} lead search credits`,
        description: "Credit packs for the FindMyClients AI lead finder. One credit is one lead search.",
        brand: { "@type": "Brand", name: SITE.name },
        url: absUrl("/pricing"),
        offers: PACKS.map((p) => ({ "@type": "Offer", name: `${p.name} — ${p.credits} searches`, price: String(p.price), priceCurrency: CURRENCY, availability: "https://schema.org/InStock", url: absUrl("/pricing") })),
      }} />
    </Page>
  );
}
