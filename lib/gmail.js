// lib/gmail.js — the owner's Gmail, through Google's official OAuth + Gmail API.
// Owner-only: one refresh token, stored in Redis when configured, otherwise in
// the GMAIL_REFRESH_TOKEN env var (the connect page shows it once to copy).
//
// Env: GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET (Google Cloud → OAuth client, type
// "Web application", redirect URI <site>/api/gmail/callback), and after connecting,
// GMAIL_REFRESH_TOKEN if Redis isn't set up.
import { redis, redisConfigured } from "./ratelimit";
import { absUrl } from "./site";

const SCOPE = "https://www.googleapis.com/auth/gmail.modify openid email"; // read threads, send, label
const TOKEN_KEY = "fmc:gmail:refresh";
const API = "https://gmail.googleapis.com/gmail/v1/users/me";
export const AGENT_LABEL = "FindMyClients";

export const gmailAppConfigured = () => !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);
export const redirectUri = () => absUrl("/api/gmail/callback");

export function authUrl(state) {
  const p = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID,
    redirect_uri: redirectUri(),
    response_type: "code",
    scope: SCOPE,
    access_type: "offline",
    prompt: "consent",
    state,
  });
  return `https://accounts.google.com/o/oauth2/v2/auth?${p}`;
}

export async function exchangeCode(code) {
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code, client_id: process.env.GOOGLE_CLIENT_ID, client_secret: process.env.GOOGLE_CLIENT_SECRET,
      redirect_uri: redirectUri(), grant_type: "authorization_code",
    }),
  });
  const j = await res.json();
  if (!res.ok) throw new Error(j.error_description || j.error || "Token exchange failed");
  return j; // { access_token, refresh_token, id_token, ... }
}

export async function saveRefreshToken(token) {
  if (!redisConfigured()) return false;
  await redis([["SET", TOKEN_KEY, token]]);
  return true;
}

async function refreshToken() {
  if (redisConfigured()) {
    const [t] = await redis([["GET", TOKEN_KEY]]).catch(() => [null]);
    if (t) return t;
  }
  return process.env.GMAIL_REFRESH_TOKEN || "";
}

let cached = { token: "", exp: 0 };
async function accessToken() {
  if (cached.token && cached.exp > Date.now() + 60_000) return cached.token;
  const rt = await refreshToken();
  if (!rt) throw Object.assign(new Error("Gmail isn't connected yet."), { code: "not_connected" });
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ refresh_token: rt, client_id: process.env.GOOGLE_CLIENT_ID, client_secret: process.env.GOOGLE_CLIENT_SECRET, grant_type: "refresh_token" }),
  });
  const j = await res.json();
  if (!res.ok) throw Object.assign(new Error("Gmail access expired or was revoked — reconnect Gmail."), { code: "not_connected" });
  cached = { token: j.access_token, exp: Date.now() + (j.expires_in || 3600) * 1000 };
  return cached.token;
}

async function gmail(path, init = {}) {
  const res = await fetch(API + path, {
    ...init,
    headers: { authorization: `Bearer ${await accessToken()}`, "content-type": "application/json", ...(init.headers || {}) },
    cache: "no-store",
  });
  const j = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(j.error?.message || `Gmail ${res.status}`);
  return j;
}

export async function profile() {
  return gmail("/profile"); // { emailAddress, messagesTotal, ... }
}

// ---- sending ---------------------------------------------------------------------
const b64url = (s) => Buffer.from(s, "utf8").toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
const encHeader = (s) => (/^[\x20-\x7e]*$/.test(s) ? s : `=?UTF-8?B?${Buffer.from(s, "utf8").toString("base64")}?=`);
const clean = (s) => String(s || "").replace(/[\r\n]+/g, " ").trim();

let labelId = "";
async function agentLabelId() {
  if (labelId) return labelId;
  const { labels = [] } = await gmail("/labels");
  const hit = labels.find((l) => l.name === AGENT_LABEL);
  labelId = hit ? hit.id : (await gmail("/labels", { method: "POST", body: JSON.stringify({ name: AGENT_LABEL, labelListVisibility: "labelShow", messageListVisibility: "show" }) })).id;
  return labelId;
}

// Send a plain-text email (or a reply in an existing thread), optionally with one
// attachment (e.g. a CV: { filename, mimeType, base64 }). Returns { id, threadId, messageId }.
export async function sendEmail({ to, subject, body, fromName = "", threadId = "", inReplyTo = "", attachment = null }) {
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(clean(to))) throw new Error("Invalid recipient email");
  const me = (await profile()).emailAddress;
  const expected = (process.env.AGENT_GMAIL || "").toLowerCase();
  if (expected && me.toLowerCase() !== expected) throw new Error(`Connected Gmail is ${me}, not ${expected} — reconnect the right account.`);
  const top = [
    `From: ${fromName ? `${encHeader(clean(fromName))} <${me}>` : me}`,
    `To: ${clean(to)}`,
    `Subject: ${encHeader(clean(subject))}`,
    "MIME-Version: 1.0",
    ...(inReplyTo ? [`In-Reply-To: ${clean(inReplyTo)}`, `References: ${clean(inReplyTo)}`] : []),
  ];
  const text = String(body).replace(/\r?\n/g, "\r\n");
  let mime;
  if (attachment?.base64 && attachment?.filename) {
    const boundary = "fmc_" + Math.random().toString(36).slice(2);
    const b64 = attachment.base64.replace(/\s+/g, "").replace(/(.{76})/g, "$1\r\n");
    mime = [
      ...top, `Content-Type: multipart/mixed; boundary="${boundary}"`, "",
      `--${boundary}`, "Content-Type: text/plain; charset=UTF-8", "Content-Transfer-Encoding: 8bit", "", text, "",
      `--${boundary}`, `Content-Type: ${attachment.mimeType || "application/pdf"}; name="${clean(attachment.filename)}"`,
      `Content-Disposition: attachment; filename="${clean(attachment.filename)}"`, "Content-Transfer-Encoding: base64", "", b64, "",
      `--${boundary}--`, "",
    ].join("\r\n");
  } else {
    mime = [...top, "Content-Type: text/plain; charset=UTF-8", "Content-Transfer-Encoding: 8bit", "", text].join("\r\n");
  }
  const raw = b64url(mime);
  const sent = await gmail("/messages/send", { method: "POST", body: JSON.stringify({ raw, ...(threadId ? { threadId } : {}) }) });
  await gmail(`/messages/${sent.id}/modify`, { method: "POST", body: JSON.stringify({ addLabelIds: [await agentLabelId()] }) }).catch(() => {});
  const meta = await gmail(`/messages/${sent.id}?format=metadata&metadataHeaders=Message-Id`).catch(() => ({}));
  const messageId = (meta.payload?.headers || []).find((h) => /^message-id$/i.test(h.name))?.value || "";
  return { id: sent.id, threadId: sent.threadId, messageId };
}

// ---- reading replies -------------------------------------------------------------
function plainBody(payload) {
  if (!payload) return "";
  if (payload.mimeType === "text/plain" && payload.body?.data) return Buffer.from(payload.body.data, "base64").toString("utf8");
  for (const p of payload.parts || []) { const t = plainBody(p); if (t) return t; }
  if (payload.mimeType === "text/html" && payload.body?.data) return Buffer.from(payload.body.data, "base64").toString("utf8").replace(/<[^>]+>/g, " ");
  return "";
}
// Drop the quoted history ("On … wrote:") so only the new reply is analysed.
const stripQuoted = (t) => t.split(/\r?\n(?:On .{5,200}wrote:|-{2,}\s*Original Message|From: .+@)/i)[0].replace(/\n>.*$/gm, "").trim();

// Returns the thread's messages with who sent each, newest last.
export async function thread(threadId) {
  const me = (await profile()).emailAddress.toLowerCase();
  const t = await gmail(`/threads/${threadId}?format=full`);
  return (t.messages || []).map((m) => {
    const h = Object.fromEntries((m.payload?.headers || []).map((x) => [x.name.toLowerCase(), x.value]));
    const from = h.from || "";
    return {
      id: m.id,
      fromMe: from.toLowerCase().includes(me),
      from,
      date: new Date(Number(m.internalDate)).toISOString(),
      subject: h.subject || "",
      messageId: h["message-id"] || "",
      text: stripQuoted(plainBody(m.payload)).slice(0, 4000),
      bounce: /mailer-daemon|postmaster/i.test(from),
    };
  });
}

// Threads matching a Gmail search (e.g. "label:FindMyClients newer_than:2d").
export async function searchThreads(q, max = 30) {
  const j = await gmail(`/threads?q=${encodeURIComponent(q)}&maxResults=${max}`);
  return (j.threads || []).map((t) => t.id);
}
