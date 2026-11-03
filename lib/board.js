// lib/board.js — data for the public /leads board, cached in Vercel's data cache
// (survives deploys), so visitors never trigger searches themselves:
//   Reddit: 6 categories × 2 searches = 12 Tavily credits per refresh, once a day.
//   Discord: free REST reads, refreshed hourly.
// A refresh that finds nothing throws, so an empty result is never cached.
import { unstable_cache } from "next/cache";

// Boards that spend Tavily credits refresh every 2 days, so boards (~9/day) plus
// visitor searches (GLOBAL_WEB_SEARCHES_PER_DAY, 20) stay inside the free
// ~1,000 searches/month with no card on file.
const SEARCH_BOARD_TTL = 60 * 60 * 48;
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
  { revalidate: SEARCH_BOARD_TTL }
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
import { hackerNewsLeads, remoteOkLeads, weWorkRemotelyLeads, remotiveLeads, arbeitnowLeads, jobicyLeads, himalayasLeads, launchLeads } from "./feeds";
import { twitterLeads } from "./twitter";

export const getFeedsBoard = unstable_cache(
  async () => {
    const safeRun = (f) => f().catch(() => []);
    const [hn, launches, ...boards] = await Promise.all([
      safeRun(hackerNewsLeads), safeRun(launchLeads),
      safeRun(remoteOkLeads), safeRun(weWorkRemotelyLeads), safeRun(remotiveLeads),
      safeRun(arbeitnowLeads), safeRun(jobicyLeads), safeRun(himalayasLeads),
    ]);
    if (!hn.length && !launches.length && !boards.some((b) => b.length)) throw new Error("feeds empty");
    // the same job is often on several boards — keep the first copy
    const seen = new Set();
    const remote = boards.flat()
      .filter((x) => { const k = (x.company + "|" + x.title).toLowerCase().replace(/[^a-z0-9|]+/g, ""); return seen.has(k) ? false : seen.add(k); })
      .sort((a, b) => (a.posted < b.posted ? 1 : -1));
    return { updated: new Date().toISOString(), hn, remote, launches: launches.slice(0, 50) };
  },
  ["feeds-board-v2"],
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
  { revalidate: SEARCH_BOARD_TTL }
);

// Public X/Twitter hiring posts — 3 Tavily credits per refresh, daily.
export const getTwitterBoard = unstable_cache(
  async () => {
    if (!searchAvailable()) return null;
    const items = await twitterLeads();
    if (!items.length) throw new Error("x board empty");
    return { updated: new Date().toISOString(), items };
  },
  ["x-board-v2"],
  { revalidate: SEARCH_BOARD_TTL }
);
