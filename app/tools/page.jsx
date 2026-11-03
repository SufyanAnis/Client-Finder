import Link from "next/link";
import { Page } from "../../components/SiteChrome";
import { Breadcrumbs } from "../../components/Content";

export const metadata = {
  title: "Free tools for freelancers & agencies",
  description: "Free tools for freelancers and small agencies: an AI lead finder, a freelance rate calculator and a cold email checker. No signup.",
  alternates: { canonical: "/tools" },
};

const TOOLS = [
  { href: "/#finder", t: "AI lead finder", d: "Find real companies that need your service right now, with a fit score, the reason to reach out and a drafted first message." },
  { href: "/tools/website-extractor", t: "Website contact extractor", d: "Paste business websites and get their public email, phone, WhatsApp and socials, what they do, their team and site issues to pitch on." },
  { href: "/tools/freelance-rate-calculator", t: "Freelance rate calculator", d: "Work out the minimum hourly and day rate that hits your income goal after expenses, tax and non-billable time." },
  { href: "/tools/cold-email-checker", t: "Cold email checker", d: "Score a cold email on length, spam triggers, clichés, links, readability and whether it ends with a clear ask." },
];

export default function Tools() {
  return (
    <Page>
      <Breadcrumbs items={[{ name: "Tools", href: "/tools" }]} />
      <header className="page-head">
        <h1>Free <em>tools.</em></h1>
        <p>Small, free tools for the business side of freelancing. No signup; the calculator and checker run entirely in your browser.</p>
      </header>
      <div className="cards">
        {TOOLS.map((x) => (
          <Link key={x.href} href={x.href} className="ccard">
            <div className="kicker">Free tool</div>
            <div className="ccard-t">{x.t}</div>
            <p>{x.d}</p>
          </Link>
        ))}
      </div>
    </Page>
  );
}
