// lib/board.js — data for the public /leads board, cached in Vercel's data cache
// (survives deploys), so visitors never trigger searches themselves:
//   Reddit: 6 categories × 2 searches = 12 Tavily credits per refresh, once a day.
//   Discord: free REST reads, refreshed hourly.
// A refresh that finds nothing throws, so an empty result is never cached.
import { unstable_cache } from "next/cache";
import { searchAvailable } from "./search";
import { BOARD, findHiringPosts } from "./reddit";
import { discordConfigured, findDiscordHiring } from "./discord";

export const getRedditBoard = unstable_cache(
  async () => {
    if (!searchAvailable()) return null;
    const cats = await Promise.all(
      BOARD.map(async (c) => ({ slug: c.slug, name: c.name, posts: await findHiringPosts(c.queries) }))
    );
    // a post can match two categories; keep it in the first only
    const seen = new Set();
    for (const c of cats) c.posts = c.posts.filter((p) => (seen.has(p.id) ? false : seen.add(p.id)));
    if (!cats.some((c) => c.posts.length)) throw new Error("reddit board empty");
    return { updated: new Date().toISOString(), cats };
  },
  ["reddit-board-v2"],
  { revalidate: 60 * 60 * 24 }
);

export const getDiscordBoard = unstable_cache(
  async () => {
    if (!discordConfigured()) return null;
    const r = await findDiscordHiring();
    return { updated: new Date().toISOString(), ...r };
  },
  ["discord-board-v1"],
  { revalidate: 60 * 60 }
);

export async function safe(fn) {
  try { return await fn(); } catch { return null; }
}
