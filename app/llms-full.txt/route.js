// /llms-full.txt — every article as Markdown in one file, for AI assistants.
import { guides, blog, professions, templates, glossary } from "../../content";
import { SITE, absUrl } from "../../lib/site";
import { articleToMd, blocksToMd } from "../../lib/markdown";

export const dynamic = "force-static";

const profToMd = (p) => articleToMd({
  title: p.title, url: `/find-clients/${p.slug}`,
  sections: [
    { heading: "Overview", blocks: (p.intro || []).map((text) => ({ type: "p", text })) },
    { heading: "Clients who buy", blocks: [{ type: "ul", items: (p.bestClients || []).map((c) => `**${c.type}**: ${c.why}`) }] },
    { heading: "Buying signals", blocks: [{ type: "ul", items: (p.buyingSignals || []).map((s) => `**${s.signal}**: ${s.howToSpot}`) }] },
    { heading: "Where to look", blocks: [{ type: "ul", items: (p.whereToLook || []).map((w) => `**${w.place}**: ${w.how}`) }] },
    { heading: "Pitch angles", blocks: [{ type: "ul", items: p.pitchAngles || [] }] },
    ...(p.sampleMessage ? [{ heading: "Sample message", blocks: [{ type: "example", text: p.sampleMessage.text }] }] : []),
    ...(p.pricingNote ? [{ heading: "Talking about price", blocks: [{ type: "p", text: p.pricingNote }] }] : []),
    { heading: "Mistakes to avoid", blocks: [{ type: "ul", items: p.mistakes || [] }] },
  ],
  faqs: p.faqs,
});

const tplToMd = (t) => articleToMd({
  title: t.title, url: `/templates/${t.slug}`, answer: t.useCase,
  sections: [
    { heading: "Template", blocks: [{ type: "example", text: t.template }] },
    { heading: "How to fill it in", blocks: [{ type: "ul", items: (t.placeholders || []).map((p) => `${p.key}: ${p.fill}`) }] },
    { heading: "Why it works", blocks: [{ type: "ul", items: t.whyItWorks || [] }] },
    ...(t.filledExample ? [{ heading: "Filled-in example", blocks: [{ type: "p", text: t.filledExample.context }, { type: "example", text: t.filledExample.text }] }] : []),
    ...(t.followUp ? [{ heading: "If there is no reply", blocks: [{ type: "p", text: t.followUp }] }] : []),
  ],
});

export function GET() {
  const parts = [
    `# ${SITE.name} — full content\n\n${SITE.description}\nIndex: ${absUrl("/llms.txt")}`,
    ...blog.map((p) => articleToMd({ title: p.title, url: `/blog/${p.slug}`, answer: p.answer, takeaways: p.keyTakeaways, sections: p.sections, faqs: p.faqs })),
    ...guides.map((g) => articleToMd({ title: g.title, url: `/guides/${g.slug}`, takeaways: g.keyTakeaways, sections: g.sections, faqs: g.faqs })),
    ...professions.map(profToMd),
    ...templates.map(tplToMd),
    ...glossary.map((t) => `# ${t.term}\nSource: ${absUrl(`/glossary/${t.slug}`)}\n\n**Definition:** ${t.short}\n\n${blocksToMd(t.blocks)}${t.example ? `\n\nExample: ${t.example}` : ""}`),
  ];
  return new Response(parts.join("\n\n---\n\n") + "\n", { headers: { "content-type": "text/markdown; charset=utf-8" } });
}
