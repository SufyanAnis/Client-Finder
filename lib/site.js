// lib/site.js
// One place for brand, URL and monetization settings. Rename the product or
// move to a custom domain by changing NAME / NEXT_PUBLIC_SITE_URL only.

export const SITE = {
  name: "FindMyClients",
  tagline: "Find clients who need you now",
  description:
    "Free AI lead finder for freelancers and agencies. Find real companies that need your service right now, score fit, and draft personalized outreach.",
  url: (process.env.NEXT_PUBLIC_SITE_URL || "https://findmyclients.vercel.app").replace(/\/$/, ""),
  operator: "Swift Labs",
  operatorLocation: "Karachi, Pakistan",
  operatorUrl: "https://website-portfolio-kdli.vercel.app/",
  contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "",
  // Personal project: nothing is sold. The credits/Safepay code stays but is off.
  selling: false,
};

// Google AdSense. Leave NEXT_PUBLIC_ADSENSE_CLIENT unset and no ad code ships.
// With only the client id set, Auto ads (chosen in the AdSense dashboard) work;
// the per-placement slot ids are optional manual units.
export const ADS = {
  client: process.env.NEXT_PUBLIC_ADSENSE_CLIENT || "", // ca-pub-XXXXXXXXXXXXXXXX
  slots: {
    inArticle: process.env.NEXT_PUBLIC_AD_SLOT_IN_ARTICLE || "",
    display: process.env.NEXT_PUBLIC_AD_SLOT_DISPLAY || "",
    multiplex: process.env.NEXT_PUBLIC_AD_SLOT_MULTIPLEX || "",
  },
};

export const absUrl = (path = "/") => SITE.url + (path.startsWith("/") ? path : "/" + path);
