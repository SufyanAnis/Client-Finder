// GET /api/gmail/callback — Google redirects here after consent (owner only).
// Saves the refresh token in Redis when available; otherwise shows it once so
// the owner can paste it into Vercel as GMAIL_REFRESH_TOKEN.
import { exchangeCode, saveRefreshToken } from "../../../../lib/gmail";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const page = (title, body) =>
  new Response(
    `<!doctype html><meta charset="utf-8"><meta name="robots" content="noindex"><title>${title}</title>
<body style="font-family:system-ui;background:#0b0b0c;color:#ececee;max-width:720px;margin:60px auto;padding:0 20px;line-height:1.6">
<h1 style="font-size:24px">${title}</h1>${body}<p><a style="color:#e7b24c" href="/agent">← Back to the agent</a></p></body>`,
    { headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-store", "set-cookie": "fmc_oauth_state=; Path=/api/gmail; Max-Age=0" } }
  );

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

export async function GET(req) {
  const url = new URL(req.url);
  const state = url.searchParams.get("state");
  const cookieState = (req.headers.get("cookie") || "").match(/fmc_oauth_state=([a-f0-9]+)/)?.[1];
  if (url.searchParams.get("error")) return page("Gmail not connected", `<p>Google said: ${esc(url.searchParams.get("error"))}</p>`);
  if (!state || state !== cookieState) return page("Gmail not connected", "<p>The sign-in link expired. Start again from the agent page.</p>");

  try {
    const tok = await exchangeCode(url.searchParams.get("code") || "");
    const email = tok.id_token ? JSON.parse(Buffer.from(tok.id_token.split(".")[1], "base64url").toString()).email : "";
    const expected = (process.env.AGENT_GMAIL || "").toLowerCase();
    if (expected && email.toLowerCase() !== expected) {
      return page("Wrong Google account", `<p>You signed in as <b>${esc(email)}</b>, but the agent is set to <b>${esc(expected)}</b>. Start again and pick the right account.</p>`);
    }
    if (!tok.refresh_token) return page("Almost — no long-term access granted", "<p>Google didn't return a refresh token. Remove the app's access at myaccount.google.com/permissions, then connect again.</p>");
    if (await saveRefreshToken(tok.refresh_token)) return page("Gmail connected ✓", `<p>Connected as <b>${esc(email)}</b>. The agent can now send approved emails and read replies.</p>`);
    return page(
      "One last step",
      `<p>Connected as <b>${esc(email)}</b>. Storage isn't set up yet, so add this token in <b>Vercel → Settings → Environment Variables</b> as <code>GMAIL_REFRESH_TOKEN</code> (type: Secret), then redeploy.</p>
<textarea readonly style="width:100%;height:110px;background:#121215;color:#ececee;border:1px solid #333;border-radius:8px;padding:10px" onclick="this.select()">${esc(tok.refresh_token)}</textarea>
<p style="color:#8c8c95">Treat it like a password: don't share it. You can revoke it anytime at myaccount.google.com/permissions.</p>`
    );
  } catch (e) {
    return page("Gmail not connected", `<p>${esc(e.message)}</p>`);
  }
}
