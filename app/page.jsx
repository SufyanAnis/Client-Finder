import LeadApp from "../components/LeadApp";

export default function Page() {
  return (
    <>
      <div className="bg" />
      <div className="shell">
        <nav className="nav">
          <div className="nav-in">
            <div className="brand">
              <div className="logo">
                {/* radar glyph */}
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19.07 4.93A10 10 0 0 0 6.99 3.34"/><path d="M4 6h.01"/><path d="M2.29 9.62A10 10 0 1 0 21.31 8.35"/><path d="M16.24 7.76A6 6 0 1 0 8.23 16.67"/><path d="M12 18h.01"/><path d="M17.99 11.66A6 6 0 0 1 15.77 16.67"/><circle cx="12" cy="12" r="2"/><path d="m13.41 10.59 5.66-5.66"/></svg>
              </div>
              <div>
                <b style={{ display: "block", lineHeight: 1 }}>Swift Labs</b>
                <span className="tag">Lead Finder</span>
              </div>
            </div>
            <a className="site" href="https://website-portfolio-kdli.vercel.app/" target="_blank" rel="noreferrer">
              Main site
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 7h10v10"/><path d="M7 17 17 7"/></svg>
            </a>
          </div>
        </nav>

        <div className="wrap">
          <header className="hero">
            <div className="pill"><span className="dot" /> Live web research · powered by Claude</div>
            <h1>Find your next <em>client.</em></h1>
            <p>
              Describe who you want to work with. The agent searches the live web for real companies that fit,
              scores each against your ideal profile, drafts a first message, and saves everything to a pipeline
              you can export to Excel any time.
            </p>
          </header>

          <LeadApp />

          <footer className="foot">
            Finds, drafts &amp; organizes — you review and send. No auto-sending, no scraping behind logins.<br />
            Leads are stored in your browser; export to Excel to keep a permanent copy. &copy; {new Date().getFullYear()} Swift Labs · Karachi.
          </footer>
        </div>
      </div>
    </>
  );
}
