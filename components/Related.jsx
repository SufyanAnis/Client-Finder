import Link from "next/link";

// "Keep reading" block: related posts, guides, templates, profession pages and terms.
export function RelatedLinks({ rel }) {
  const groups = [
    { title: "Blog", items: rel.blog || [], href: (x) => `/blog/${x.slug}`, label: (x) => x.title },
    { title: "Guides", items: rel.guides || [], href: (x) => `/guides/${x.slug}`, label: (x) => x.title },
    { title: "Templates", items: rel.templates || [], href: (x) => `/templates/${x.slug}`, label: (x) => x.title },
    { title: "By profession", items: rel.professions || [], href: (x) => `/find-clients/${x.slug}`, label: (x) => `Find clients for ${x.name.toLowerCase()}` },
    { title: "Glossary", items: rel.glossary || [], href: (x) => `/glossary/${x.slug}`, label: (x) => x.term },
  ].filter((g) => g.items.length);
  if (!groups.length) return null;
  return (
    <section className="related">
      <h2>Keep reading</h2>
      <div className="related-grid">
        {groups.map((g) => (
          <div key={g.title}>
            <div className="label">{g.title}</div>
            <ul>{g.items.map((x) => <li key={x.slug}><Link href={g.href(x)}>{g.label(x)}</Link></li>)}</ul>
          </div>
        ))}
      </div>
    </section>
  );
}

// Card grid used on index pages and the home page.
export function CardGrid({ items, href, kicker, title, text }) {
  return (
    <div className="cards">
      {items.map((x) => (
        <Link key={x.slug} href={href(x)} className="ccard">
          {kicker && <div className="kicker">{kicker(x)}</div>}
          <div className="ccard-t">{title(x)}</div>
          {text && <p>{text(x)}</p>}
        </Link>
      ))}
    </div>
  );
}
