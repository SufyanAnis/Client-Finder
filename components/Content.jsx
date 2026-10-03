// Renderers for the structured content in /content (see content/CONTENT_SPEC.md).
// Server components, except CopyButton.
import Link from "next/link";
import CopyButton from "./CopyButton";
import { absUrl } from "../lib/site";

// Inline markup: **bold** and [text](href). Nothing else is interpreted.
export function Rich({ text }) {
  if (!text) return null;
  const parts = String(text).split(/(\*\*[^*]+\*\*|\[[^\]]+\]\([^)\s]+\))/g);
  return parts.map((p, i) => {
    if (p.startsWith("**") && p.endsWith("**") && p.length > 4) return <strong key={i}>{p.slice(2, -2)}</strong>;
    const m = p.match(/^\[([^\]]+)\]\(([^)\s]+)\)$/);
    if (m) {
      const [, label, href] = m;
      return href.startsWith("/")
        ? <Link key={i} href={href}>{label}</Link>
        : <a key={i} href={href} target="_blank" rel="noopener">{label}</a>;
    }
    return p;
  });
}

export function Blocks({ blocks = [] }) {
  return blocks.map((b, i) => {
    switch (b.type) {
      case "ul": return <ul key={i}>{b.items.map((t, j) => <li key={j}><Rich text={t} /></li>)}</ul>;
      case "ol": return <ol key={i}>{b.items.map((t, j) => <li key={j}><Rich text={t} /></li>)}</ol>;
      case "tip": return <div key={i} className="tip"><span className="tip-k">Tip</span><p><Rich text={b.text} /></p></div>;
      case "example": return <Example key={i} label={b.label} text={b.text} />;
      case "table": return <Table key={i} caption={b.caption} head={b.head} rows={b.rows} />;
      default: return <p key={i}><Rich text={b.text} /></p>;
    }
  });
}

export function Example({ label, text }) {
  return (
    <div className="msgbox example">
      <div className="msgbar">
        <span className="t">{label || "Example"}</span>
        <CopyButton text={text} />
      </div>
      <div className="msgtext">{text}</div>
    </div>
  );
}

export function Table({ caption, head = [], rows = [] }) {
  return (
    <div className="ptable">
      <table>
        {caption && <caption>{caption}</caption>}
        <thead><tr>{head.map((h, i) => <th key={i} scope="col"><Rich text={h} /></th>)}</tr></thead>
        <tbody>{rows.map((r, i) => <tr key={i}>{r.map((c, j) => <td key={j}><Rich text={c} /></td>)}</tr>)}</tbody>
      </table>
    </div>
  );
}

// The answer-first block: a standalone direct answer that search snippets and
// answer engines can lift verbatim.
export function AnswerBox({ answer, label = "Short answer" }) {
  if (!answer) return null;
  return (
    <div className="answer" id="short-answer">
      <div className="label">{label}</div>
      <p><Rich text={answer} /></p>
    </div>
  );
}

export function Byline({ author, updated, published, minutes }) {
  return (
    <div className="byline">
      <Link href={`/authors/${author.slug}`} className="by-name">{author.name}</Link>
      <span className="by-role">{author.role}</span>
      <span className="by-meta">
        {published && published !== updated ? <>Published {fmtDate(published)} · </> : null}
        Updated <time dateTime={updated}>{fmtDate(updated)}</time>{minutes ? ` · ${minutes} min read` : ""}
      </span>
    </div>
  );
}

export function fmtDate(d) {
  return new Date(d + "T00:00:00Z").toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" });
}

export const plainText = (t) => String(t || "").replace(/\*\*([^*]+)\*\*/g, "$1").replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");

export const slugify =(s) => String(s).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export function JsonLd({ data }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}

// items: [{ name, href }], last one is the current page.
export function Breadcrumbs({ items }) {
  const all = [{ name: "Home", href: "/" }, ...items];
  return (
    <>
      <nav className="crumbs" aria-label="Breadcrumb">
        {all.map((c, i) => (
          <span key={c.href}>
            {i < all.length - 1 ? <Link href={c.href}>{c.name}</Link> : <span aria-current="page">{c.name}</span>}
            {i < all.length - 1 && <span className="sep">/</span>}
          </span>
        ))}
      </nav>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: all.map((c, i) => ({ "@type": "ListItem", position: i + 1, name: c.name, item: absUrl(c.href) })),
        }}
      />
    </>
  );
}

export function Faqs({ faqs = [], heading = "Frequently asked questions" }) {
  if (!faqs.length) return null;
  const plain = (t) => String(t).replace(/\*\*([^*]+)\*\*/g, "$1").replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");
  return (
    <section className="faqs" id="faq">
      <h2>{heading}</h2>
      {faqs.map((f, i) => (
        <details key={i} className="faq" open={i === 0}>
          <summary>{f.q}</summary>
          <p><Rich text={f.a} /></p>
        </details>
      ))}
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: plain(f.a) } })),
        }}
      />
    </section>
  );
}

// Call-to-action into the finder, optionally prefilled.
export function ToolCta({ title = "Find companies that need you right now", text, service, niche }) {
  const qs = new URLSearchParams();
  if (service) qs.set("service", service);
  if (niche) qs.set("niche", niche);
  const href = "/" + (qs.toString() ? "?" + qs.toString() : "") + "#finder";
  return (
    <div className="cta-box">
      <div>
        <div className="cta-t">{title}</div>
        <p>{text || "Describe what you sell and who you want to work with. FindMyClients searches the live web for companies showing a current need, scores fit and drafts your first message. Free, no signup."}</p>
      </div>
      <Link className="go cta-go" href={href}>Run a free search →</Link>
    </div>
  );
}
