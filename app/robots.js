import { absUrl } from "../lib/site";

export default function robots() {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/api/", "/inbox", "/login"] }],
    sitemap: absUrl("/sitemap.xml"),
  };
}
