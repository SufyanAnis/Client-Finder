import "./globals.css";
import "./site.css";
import { SITE, ADS } from "../lib/site";

// Fonts load from Google Fonts with a plain stylesheet link. (next/font/google broke in
// Nov 2026: Next 14's build-time loader can no longer parse Google's CSS response.)
const FONTS_CSS =
  "https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,600;12..96,700;12..96,800&family=Hanken+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap";

export const metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} — Free AI lead finder for freelancers & agencies`,
    template: `%s · ${SITE.name}`,
  },
  description: SITE.description,
  applicationName: SITE.name,
  openGraph: { type: "website", siteName: SITE.name, locale: "en_US" },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
  verification: process.env.NEXT_PUBLIC_GSC_VERIFICATION ? { google: process.env.NEXT_PUBLIC_GSC_VERIFICATION } : undefined,
  // AdSense site verification (the meta-tag method), alongside the script below.
  other: ADS.client ? { "google-adsense-account": ADS.client } : undefined,
};

export const viewport = {
  themeColor: "#0B0B0C",
  colorScheme: "dark",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="stylesheet" href={FONTS_CSS} />
        {ADS.client ? (
          <script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADS.client}`}
            crossOrigin="anonymous"
          />
        ) : null}
      </head>
      <body>{children}</body>
    </html>
  );
}
