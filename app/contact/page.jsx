import { Page } from "../../components/SiteChrome";
import { Breadcrumbs } from "../../components/Content";
import ContactForm from "../../components/ContactForm";
import { SITE } from "../../lib/site";

export const metadata = {
  title: "Contact",
  description: `Contact the ${SITE.name} team: feedback, bug reports, corrections to a guide, partnership questions or a removal request.`,
  alternates: { canonical: "/contact" },
};

export default function Contact() {
  return (
    <Page narrow>
      <Breadcrumbs items={[{ name: "Contact", href: "/contact" }]} />
      <article className="article">
        <header className="art-head">
          <h1>Contact us</h1>
          <p className="lede">Feedback, a bug, a correction to a guide, or a company that wants to be removed from results — we read everything and usually reply within two working days.</p>
        </header>
        <ContactForm />
        {SITE.contactEmail && (
          <p className="fine" style={{ marginTop: 18 }}>Prefer email? Write to <a href={"mailto:" + SITE.contactEmail}>{SITE.contactEmail}</a>.</p>
        )}
        <p className="fine">{SITE.name} is run by {SITE.operator}, {SITE.operatorLocation}.</p>
      </article>
    </Page>
  );
}
