import { guides, professions, templates, blog, glossary, BLOG_CATEGORIES, CONTENT_UPDATED } from "../content";
import { AUTHORS } from "../lib/authors";
import { absUrl } from "../lib/site";

export default function sitemap() {
  const at = (path, priority, changeFrequency = "monthly", lastModified = CONTENT_UPDATED) => ({
    url: absUrl(path), lastModified, changeFrequency, priority,
  });
  return [
    at("/", 1, "weekly"),
    at("/blog", 0.9, "daily"),
    at("/guides", 0.8, "weekly"),
    at("/templates", 0.8, "weekly"),
    at("/find-clients", 0.8, "weekly"),
    at("/glossary", 0.7, "weekly"),
    at("/tools", 0.7),
    at("/tools/freelance-rate-calculator", 0.8),
    at("/tools/cold-email-checker", 0.8),
    ...blog.map((p) => at(`/blog/${p.slug}`, 0.8, "monthly", p.updated)),
    ...BLOG_CATEGORIES.map((c) => at(`/blog/category/${c.slug}`, 0.6, "weekly")),
    ...guides.map((g) => at(`/guides/${g.slug}`, 0.8, "monthly", g.updated)),
    ...professions.map((p) => at(`/find-clients/${p.slug}`, 0.7)),
    ...templates.map((t) => at(`/templates/${t.slug}`, 0.7)),
    ...glossary.map((t) => at(`/glossary/${t.slug}`, 0.5)),
    ...Object.keys(AUTHORS).map((s) => at(`/authors/${s}`, 0.4, "yearly")),
    at("/pricing", 0.8, "monthly"),
    at("/refund-policy", 0.2, "yearly"),
    at("/about", 0.4, "yearly"),
    at("/contact", 0.3, "yearly"),
    at("/privacy", 0.2, "yearly"),
    at("/terms", 0.2, "yearly"),
  ];
}
