import { guides, professions, templates, CONTENT_UPDATED } from "../content";
import { absUrl } from "../lib/site";

export default function sitemap() {
  const at = (path, priority, changeFrequency = "monthly", lastModified = CONTENT_UPDATED) => ({
    url: absUrl(path), lastModified, changeFrequency, priority,
  });
  return [
    at("/", 1, "weekly"),
    at("/guides", 0.8, "weekly"),
    at("/templates", 0.8, "weekly"),
    at("/find-clients", 0.8, "weekly"),
    ...guides.map((g) => at(`/guides/${g.slug}`, 0.7, "monthly", g.updated)),
    ...professions.map((p) => at(`/find-clients/${p.slug}`, 0.7)),
    ...templates.map((t) => at(`/templates/${t.slug}`, 0.6)),
    at("/about", 0.4, "yearly"),
    at("/contact", 0.3, "yearly"),
    at("/privacy", 0.2, "yearly"),
    at("/terms", 0.2, "yearly"),
  ];
}
