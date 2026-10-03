// lib/markdown.js — renders structured content as Markdown for llms-full.txt
// (the plain-text version of the site that AI assistants can ingest in one go).
import { absUrl } from "./site";

const inline = (t) => String(t || "").replace(/\]\((\/[^)]*)\)/g, (_, p) => `](${absUrl(p)})`);

export function blocksToMd(blocks = []) {
  return blocks.map((b) => {
    switch (b.type) {
      case "ul": return b.items.map((x) => `- ${inline(x)}`).join("\n");
      case "ol": return b.items.map((x, i) => `${i + 1}. ${inline(x)}`).join("\n");
      case "tip": return `> Tip: ${inline(b.text)}`;
      case "example": return `${b.label ? `**${b.label}**\n` : ""}\`\`\`\n${b.text}\n\`\`\``;
      case "table": return [
        b.caption ? `*${b.caption}*` : "",
        `| ${b.head.map(inline).join(" | ")} |`,
        `| ${b.head.map(() => "---").join(" | ")} |`,
        ...b.rows.map((r) => `| ${r.map(inline).join(" | ")} |`),
      ].filter(Boolean).join("\n");
      default: return inline(b.text);
    }
  }).join("\n\n");
}

export function faqsToMd(faqs = []) {
  if (!faqs.length) return "";
  return "## FAQ\n\n" + faqs.map((f) => `**${f.q}**\n${inline(f.a)}`).join("\n\n");
}

export function articleToMd({ title, url, answer, takeaways, sections = [], faqs }) {
  return [
    `# ${title}`,
    `Source: ${absUrl(url)}`,
    answer ? `**Short answer:** ${inline(answer)}` : "",
    takeaways?.length ? "Key takeaways:\n" + takeaways.map((t) => `- ${inline(t)}`).join("\n") : "",
    ...sections.map((s) => `## ${s.heading}\n\n${blocksToMd(s.blocks)}`),
    faqsToMd(faqs),
  ].filter(Boolean).join("\n\n");
}
