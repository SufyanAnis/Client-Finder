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

// Free official feeds (Hacker News, Remote OK, We Work Remotely) — no credits used.
import { hackerNewsLeads, remoteOkLeads, weWorkRemotelyLeads } from "./feeds";

export const getFeedsBoard = unstable_cache(
  async () => {
    const [hn, rok, wwr] = await Promise.all([
      hackerNewsLeads().catch(() => []),
      remoteOkLeads().catch(() => []),
      weWorkRemotelyLeads().catch(() => []),
    ]);
    if (!hn.length && !rok.length && !wwr.length) throw new Error("feeds empty");
    const remote = [...rok, ...wwr].sort((a, b) => (a.posted < b.posted ? 1 : -1));
    return { updated: new Date().toISOString(), hn, remote };
  },
  ["feeds-board-v1"],
  { revalidate: 60 * 60 * 6 }
);

// Public LinkedIn freelance/contract job posts — 4 Tavily credits per refresh, daily.
import { linkedInLeads } from "./linkedin";

export const getLinkedInBoard = unstable_cache(
  async () => {
    if (!searchAvailable()) return null;
    const items = await linkedInLeads();
    if (!items.length) throw new Error("linkedin board empty");
    return { updated: new Date().toISOString(), items };
  },
  ["linkedin-board-v1"],
  { revalidate: 60 * 60 * 24 }
);
