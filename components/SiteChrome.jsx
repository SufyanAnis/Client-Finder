// Shared page frame: background, sticky nav, footer. Server component.
import Link from "next/link";
import { SITE } from "../lib/site";

const NAV = [
  { href: "/guides", label: "Guides" },
  { href: "/templates", label: "Templates" },
  { href: "/find-clients", label: "By profession" },
  { href: "/about", label: "About" },
];

export function Logo() {
  return (
    <div className="logo" aria-hidden="true">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19.07 4.93A10 10 0 0 0 6.99 3.34"/><path d="M4 6h.01"/><path d="M2.29 9.62A10 10 0 1 0 21.31 8.35"/><path d="M16.24 7.76A6 6 0 1 0 8.23 16.67"/><path d="M12 18h.01"/><path d="M17.99 11.66A6 6 0 0 1 15.77 16.67"/><circle cx="12" cy="12" r="2"/><path d="m13.41 10.59 5.66-5.66"/></svg>
    </div>
  );
}

export function SiteHeader() {
  return (
    <nav className="nav" aria-label="Main">
      <div className="nav-in">
        <Link href="/" className="brand" aria-label={`${SITE.name} home`}>
          <Logo />
          <div>
            <b style={{ display: "block", lineHeight: 1 }}>{SITE.name}</b>
            <span className="tag">Free lead finder</span>
          </div>
        </Link>
        <div className="nav-links">
          {NAV.map((n) => <Link key={n.href} className="site" href={n.href}>{n.label}</Link>)}
          <Link className="nav-cta" href="/#finder">Find clients</Link>
        </div>
        <details className="nav-mobile">
          <summary aria-label="Menu">Menu</summary>
          <div className="nav-drop">
            <Link href="/#finder">Find clients</Link>
            {NAV.map((n) => <Link key={n.href} href={n.href}>{n.label}</Link>)}
            <Link href="/contact">Contact</Link>
          </div>
        </details>
      </div>
    </nav>
  );
}

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="site-foot">
      <div className="wrap foot-grid">
        <div>
          <div className="brand" style={{ marginBottom: 12 }}>
            <Logo />
            <b>{SITE.name}</b>
          </div>
          <p className="foot-about">
            A free lead finder for freelancers and small agencies. It finds and drafts — you review and send.
            No auto-sending, no scraping behind logins.
          </p>
        </div>
        <div>
          <div className="foot-h">Tool</div>
          <Link href="/#finder">Lead finder</Link>
          <Link href="/find-clients">Find clients by profession</Link>
          <Link href="/templates">Outreach templates</Link>
        </div>
        <div>
          <div className="foot-h">Learn</div>
          <Link href="/guides">All guides</Link>
          <Link href="/guides/how-to-find-clients-as-a-freelancer">Finding clients</Link>
          <Link href="/guides/cold-email-that-gets-replies">Cold email</Link>
          <Link href="/guides/cold-outreach-laws">Outreach laws</Link>
        </div>
        <div>
          <div className="foot-h">Company</div>
          <Link href="/about">About</Link>
          <Link href="/contact">Contact</Link>
          <Link href="/privacy">Privacy policy</Link>
          <Link href="/terms">Terms of use</Link>
        </div>
      </div>
      <div className="wrap foot-base">
        &copy; {year} {SITE.name}. Built by{" "}
        <a href={SITE.operatorUrl} target="_blank" rel="noopener">{SITE.operator}</a>, {SITE.operatorLocation}.
      </div>
    </footer>
  );
}

export function Page({ children, narrow }) {
  return (
    <>
      <div className="bg" />
      <div className="shell">
        <SiteHeader />
        <main className={narrow ? "wrap wrap-narrow" : "wrap"}>{children}</main>
        <SiteFooter />
      </div>
    </>
  );
}
