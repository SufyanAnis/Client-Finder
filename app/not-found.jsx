import Link from "next/link";
import { Page } from "../components/SiteChrome";

export const metadata = { title: "Page not found", robots: { index: false } };

export default function NotFound() {
  return (
    <Page narrow>
      <header className="page-head" style={{ paddingBottom: 40 }}>
        <h1>Page not <em>found.</em></h1>
        <p>That page doesn't exist or has moved. Try the <Link href="/">lead finder</Link>, the <Link href="/guides">guides</Link> or the <Link href="/templates">templates</Link>.</p>
      </header>
    </Page>
  );
}
