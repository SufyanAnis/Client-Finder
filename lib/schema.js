// lib/schema.js — schema.org JSON-LD builders shared by content pages.
import { SITE, absUrl } from "./site";

export const publisher = () => ({
  "@type": "Organization",
  "@id": SITE.url + "/#org",
  name: SITE.name,
  url: SITE.url,
  logo: { "@type": "ImageObject", url: absUrl("/icon.svg") },
});

export const personLd = (a) => ({
  "@type": "Person",
  "@id": absUrl(`/authors/${a.slug}`) + "#person",
  name: a.name,
  jobTitle: a.role,
  url: absUrl(`/authors/${a.slug}`),
  sameAs: (a.links || []).map((l) => l.url),
});

export function articleLd({ type = "Article", title, description, path, published, updated, author, image, section, words }) {
  return {
    "@context": "https://schema.org",
    "@type": type,
    headline: title,
    description,
    url: absUrl(path),
    mainEntityOfPage: absUrl(path),
    datePublished: published || updated,
    dateModified: updated,
    image: image ? [absUrl(image)] : [absUrl("/opengraph-image")],
    author: author ? personLd(author) : publisher(),
    publisher: publisher(),
    inLanguage: "en",
    ...(section ? { articleSection: section } : {}),
    ...(words ? { wordCount: words } : {}),
    // Marks the passages assistants should read aloud / quote first.
    speakable: { "@type": "SpeakableSpecification", cssSelector: ["h1", "#short-answer p"] },
  };
}

export function howToLd({ howTo, path }) {
  if (!howTo?.steps?.length) return null;
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: howTo.name,
    url: absUrl(path),
    step: howTo.steps.map((s, i) => ({ "@type": "HowToStep", position: i + 1, name: s.name, text: s.text })),
  };
}

export const wordCount = (obj) =>
  JSON.stringify(obj).replace(/"(type|heading|blocks|text|items|label|caption|head|rows)":/g, " ").split(/\s+/).filter(Boolean).length;
