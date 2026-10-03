import { Page } from "../../../components/SiteChrome";
import { Breadcrumbs, Faqs, JsonLd, ToolCta, AnswerBox } from "../../../components/Content";
import RateCalculator from "../../../components/RateCalculator";
import { SITE, absUrl } from "../../../lib/site";

export const metadata = {
  title: "Freelance rate calculator: hourly & day rate",
  description:
    "Free freelance rate calculator. Enter your income goal, expenses, tax and billable hours to get your minimum hourly rate, day rate and monthly revenue target.",
  alternates: { canonical: "/tools/freelance-rate-calculator" },
};

const FAQ = [
  { q: "How do I calculate my freelance hourly rate?", a: "Add the take-home income you want to your yearly business expenses, divide by one minus your tax rate to get the revenue you need, then divide by the hours you can actually bill in a year. That gives your break-even floor. Add a buffer of 10–20% for quiet months and late payers." },
  { q: "What is a realistic number of billable hours?", a: "Far fewer than you work. Sales, admin, invoicing and learning take a big share of a freelancer's week, so many freelancers bill somewhere around half to two-thirds of their working hours. Track your own time for a month and use your real figure." },
  { q: "Should I charge hourly or per project?", a: "Use your hourly rate as an internal floor either way. Many freelancers quote per project or per day so clients compare value rather than hours — see our guide to [fixed price vs hourly](/blog/fixed-price-vs-hourly). Just make sure each fixed price works out above your floor." },
  { q: "Is the result my market rate?", a: "No — it's the minimum that meets your income goal. Your market rate depends on your niche, results and clients' budgets, and can be much higher. If your floor is above what your market pays, you need higher-value clients, more billable time or lower costs. See [how much to charge as a freelancer](/blog/how-much-to-charge-as-a-freelancer)." },
];

export default function Page_() {
  return (
    <Page narrow>
      <Breadcrumbs items={[{ name: "Tools", href: "/tools" }, { name: "Freelance rate calculator", href: "/tools/freelance-rate-calculator" }]} />
      <header className="art-head">
        <div className="kicker">Free tool</div>
        <h1>Freelance rate calculator</h1>
      </header>
      <AnswerBox label="How it works" answer="Your minimum freelance rate is the revenue you need — take-home income plus business expenses, grossed up for tax — divided by the hours you can actually bill in a year, plus a safety buffer. Enter your numbers below; everything is calculated in your browser." />
      <RateCalculator />
      <div className="prose">
        <h2 id="why-billable-hours">Why billable hours matter most</h2>
        <p>The most common pricing mistake is dividing an income goal by 40 hours × 52 weeks. You won't bill that: holidays, sick days, sales calls, proposals, invoicing and admin all eat into the week. Using a realistic billable share is what turns a rate that looks fine on paper into one that actually pays you.</p>
        <h2 id="raise-the-floor">If the number feels too high</h2>
        <ul>
          <li><strong>Find clients with bigger budgets.</strong> A narrower niche and companies showing a real need pay more — that's what <a href="/">the {SITE.name} finder</a> is built to surface.</li>
          <li><strong>Sell outcomes, not hours.</strong> Package work into fixed-scope offers priced on value.</li>
          <li><strong>Raise billable time.</strong> Systemize sales and admin so more of your week is paid work.</li>
        </ul>
      </div>
      <Faqs faqs={FAQ} />
      <ToolCta title="Now find clients who can pay it" />
      <JsonLd data={{
        "@context": "https://schema.org", "@type": "WebApplication", name: "Freelance rate calculator",
        url: absUrl("/tools/freelance-rate-calculator"), applicationCategory: "BusinessApplication", operatingSystem: "Any (web browser)",
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" }, publisher: { "@type": "Organization", name: SITE.name, url: SITE.url },
      }} />
    </Page>
  );
}
