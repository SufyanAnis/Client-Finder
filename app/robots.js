import { absUrl } from "../lib/site";

// Search engines AND AI answer engines are welcome on content pages — being
// crawlable by them is how the site gets cited in AI Overviews, ChatGPT search,
// Perplexity, Copilot and Claude. Private/API routes stay out.
const PRIVATE = ["/api/", "/inbox", "/login", "/pricing/success"];
const AI_BOTS = [
  "GPTBot", "OAI-SearchBot", "ChatGPT-User", "PerplexityBot", "Perplexity-User", "ClaudeBot", "Claude-SearchBot",
  "Claude-User", "Google-Extended", "Applebot-Extended", "Bingbot", "DuckAssistBot", "Amazonbot", "meta-externalagent", "CCBot",
];

export default function robots() {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: PRIVATE },
      ...AI_BOTS.map((userAgent) => ({ userAgent, allow: "/", disallow: PRIVATE })),
    ],
    sitemap: absUrl("/sitemap.xml"),
  };
}
