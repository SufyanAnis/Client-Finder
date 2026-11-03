// lib/discord.js — hiring messages from Discord channels, read with YOUR bot.
//
// Discord can't be searched from outside, and logging in with a user account to
// scrape ("self-bots") breaks Discord's terms. The allowed way: create a bot in
// the Discord Developer Portal, enable the Message Content intent, and have the
// admins of each server add it. Then the bot can read the channels it's given.
// Uses the plain REST API (no websocket), so it works on serverless and is free.
//
// Env: DISCORD_BOT_TOKEN, DISCORD_CHANNEL_IDS (comma-separated channel ids,
// optionally "id:Label" to name a channel on the board).

const API = "https://discord.com/api/v10";
const HIRING = /(^|\W)(\[?hiring\]?|looking\s+for\s+(a|an|someone)|looking\s+to\s+hire|need(ed)?\s+(a|an|someone)|seeking|paid\s+(gig|task|project|work)|budget)(\W|$)/i;
const NOT_HIRING = /(\[?\s*for\s*hire\s*\]?|forhire|available\s+for|open\s+for\s+(work|commissions)|my\s+portfolio|i\s+(can|will)\s+(build|design|make|create|edit))/i;

export function discordConfigured() {
  return !!(process.env.DISCORD_BOT_TOKEN && process.env.DISCORD_CHANNEL_IDS);
}

export function discordChannels() {
  return String(process.env.DISCORD_CHANNEL_IDS || "")
    .split(",").map((s) => s.trim()).filter(Boolean)
    .map((s) => { const [id, ...label] = s.split(":"); return { id: id.trim(), label: label.join(":").trim() }; })
    .filter((c) => /^\d{15,22}$/.test(c.id));
}

async function api(path) {
  const res = await fetch(API + path, {
    headers: { Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}` },
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Discord ${res.status} on ${path}`);
  return res.json();
}

// Message ids are snowflakes: the timestamp is in the top bits.
const snowflakeDate = (id) => new Date(Number(BigInt(id) >> 22n) + 1420070400000).toISOString();

export function isHiringMessage(text) {
  const t = String(text || "");
  return t.length > 25 && HIRING.test(t) && !NOT_HIRING.test(t);
}

// Recent hiring messages across the configured channels (newest first). Author
// names are deliberately left out — only the job text, channel and a link.
export async function findDiscordHiring({ perChannel = 50, maxAgeDays = 14 } = {}) {
  if (!discordConfigured()) return { posts: [], channels: [], errors: [] };
  const cutoff = Date.now() - maxAgeDays * 86400000;
  const errors = [];
  const channels = [];
  const lists = await Promise.all(
    discordChannels().map(async (c) => {
      try {
        const info = await api(`/channels/${c.id}`);
        const guild = info.guild_id ? await api(`/guilds/${info.guild_id}`).catch(() => null) : null;
        const label = c.label || `${guild?.name ? guild.name + " · " : ""}#${info.name}`;
        channels.push({ id: c.id, label });
        const msgs = await api(`/channels/${c.id}/messages?limit=${Math.min(perChannel, 100)}`);
        return msgs
          .map((m) => {
            const text = [m.content, ...(m.embeds || []).map((e) => [e.title, e.description].filter(Boolean).join(" — "))].filter(Boolean).join("\n").trim();
            return { m, text };
          })
          .filter(({ m, text }) => !m.author?.bot || text) // keep job-board bot reposts too
          .filter(({ m, text }) => Date.parse(snowflakeDate(m.id)) >= cutoff && isHiringMessage(text))
          .map(({ m, text }) => ({
            id: m.id,
            text: text.replace(/<@!?\d+>|<#\d+>|<@&\d+>/g, "").replace(/\s+\n/g, "\n").slice(0, 400),
            channel: label,
            url: `https://discord.com/channels/${info.guild_id || "@me"}/${c.id}/${m.id}`,
            posted: snowflakeDate(m.id),
            budget: (text.match(/(?:\$|USD|£|€|₹|INR|Rs\.?)\s?\d[\d,.]*(?:\s?[kK])?(?:\s?(?:-|–|to)\s?(?:\$|£|€|₹)?\s?\d[\d,.]*(?:\s?[kK])?)?/) || [])[0] || "",
          }));
      } catch (e) {
        errors.push(`${c.label || c.id}: ${e.message}`);
        return [];
      }
    })
  );
  const posts = lists.flat().sort((a, b) => (a.posted < b.posted ? 1 : -1));
  return { posts, channels, errors };
}
