"use client";

// The owner's outreach agent. State lives in this browser (localStorage); every
// email thread also lives in Gmail under the "FindMyClients" label.
import { useEffect, useMemo, useState } from "react";
import { Loader2, Mail, Send, Sparkles, RefreshCw, Check, ExternalLink, Trash2, Plus, AlertTriangle, Inbox, Settings, BarChart3, ListChecks } from "lucide-react";
import CopyButton from "./CopyButton";

const KEY = "fmc_agent_v1";
const INBOX = "fmc_agent_inbox"; // items sent here from the Fresh leads board
const PIPE = "fmc_pipeline_v1";
const DAY = 86400000;

const load = (k, d) => { try { return JSON.parse(localStorage.getItem(k) || "null") ?? d; } catch { return d; } };
const save = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} };
const uid = () => Math.random().toString(36).slice(2, 10);
const host = (u) => { try { return new URL(/^https?:/.test(u) ? u : "https://" + u).hostname.replace(/^www\./, ""); } catch { return ""; } };

// What kind of action fits a lead: email it, apply on the post, or reply to the post.
export function kindFor(l) {
  if (/reddit|x \(twitter\)|^x$/i.test(l.source || "")) return "reply";
  if (l.email) return "email";
  if (/linkedin|remote ok|we work remotely|remotive|arbeitnow|jobicy|himalayas|hacker news/i.test(l.source || "")) return "apply";
  return l.website ? "email" : l.url ? "apply" : "email";
}

const STATUS_LABEL = { new: "New", drafted: "Draft ready", sent: "Sent", applied: "Applied", replied: "Replied", won: "Won", lost: "Closed", stopped: "Stopped" };

async function post(url, body) {
  const res = await fetch(url, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
  const d = await res.json().catch(() => ({}));
  if (!res.ok || d.error) { const e = new Error(d.error || `Error ${res.status}`); e.code = d.code; throw e; }
  return d;
}

export default function Agent() {
  const [tab, setTab] = useState("queue");
  const [st, setSt] = useState({ profile: {}, leads: [] });
  const [ready, setReady] = useState(false);
  const [gmail, setGmail] = useState(null);
  const [busy, setBusy] = useState({});
  const [msg, setMsg] = useState("");

  useEffect(() => {
    const s = load(KEY, { profile: {}, leads: [] });
    // pull in anything sent from the Fresh leads board
    const inbox = load(INBOX, []);
    if (inbox.length) {
      const have = new Set(s.leads.map((l) => l.url || l.website || l.company));
      inbox.forEach((x) => { const k = x.url || x.website || x.company; if (!have.has(k)) s.leads.unshift({ ...x, id: uid(), kind: kindFor(x), status: "new", added: new Date().toISOString() }); });
      save(INBOX, []);
    }
    setSt(s); setReady(true);
    try { localStorage.setItem("fmc_owner", "1"); } catch {}
    fetch("/api/gmail/status").then((r) => r.json()).then(setGmail).catch(() => setGmail({ app: false }));
  }, []);
  useEffect(() => { if (ready) save(KEY, st); }, [st, ready]);

  const upd = (id, patch) => setSt((s) => ({ ...s, leads: s.leads.map((l) => (l.id === id ? { ...l, ...(typeof patch === "function" ? patch(l) : patch) } : l)) }));
  const remove = (id) => setSt((s) => ({ ...s, leads: s.leads.filter((l) => l.id !== id) }));
  const setProfile = (k, v) => setSt((s) => ({ ...s, profile: { ...s.profile, [k]: v } }));
  const flag = (id, v) => setBusy((b) => ({ ...b, [id]: v }));

  const queue = st.leads.filter((l) => ["new", "drafted"].includes(l.status));
  const tracking = st.leads.filter((l) => ["sent", "applied", "replied", "won", "lost", "stopped"].includes(l.status));
  const followUpDue = (l) => l.kind === "email" && l.status === "sent" && !l.replies && (l.followups || 0) < 2 && Date.now() - Date.parse(l.lastSentAt || l.sentAt) > ((l.followups || 0) === 0 ? 3 : 4) * DAY;

  // ---- actions ----
  async function draft(l, type) {
    flag(l.id, "draft"); setMsg("");
    try {
      const d = await post("/api/agent/draft", { type: type || (l.kind === "email" ? "email" : l.kind), lead: l, profile: st.profile, research: l.research, skipResearch: !!l.research, thread: l.messages || [] });
      if (d.skip) { upd(l.id, { status: "stopped", skipReason: d.skip, research: d.research }); setMsg(`Skipped ${l.company || host(l.website)}: ${d.skip}`); flag(l.id, false); return; }
      const to = l.email || d.research?.emails?.[0] || "";
      if (["followup", "response"].includes(type)) upd(l.id, { pending: { type, subject: d.subject, body: d.body } });
      else upd(l.id, { status: "drafted", research: d.research, email: to, draft: { subject: d.subject, body: d.body, to }, kind: l.kind === "apply" || l.kind === "reply" ? l.kind : to ? "email" : l.url ? "apply" : "email" });
    } catch (e) { setMsg(`${l.company || host(l.website)}: ${e.message}`); }
    flag(l.id, false);
  }

  async function draftAll() {
    for (const l of queue.filter((x) => x.status === "new").slice(0, 10)) await draft(l);
  }

  async function sendEmail(l, { subject, body, to, threadId, inReplyTo, followup }) {
    flag(l.id, "send"); setMsg("");
    try {
      const r = await post("/api/agent/send", { to, subject, body, fromName: st.profile.name || "", threadId, inReplyTo });
      const msgRec = { fromMe: true, date: r.sentAt, text: body, messageId: r.messageId };
      upd(l.id, (x) => ({
        status: followup === "response" ? "replied" : "sent", threadId: r.threadId, messageId: r.messageId,
        sentAt: x.sentAt || r.sentAt, lastSentAt: r.sentAt, followups: followup === "followup" ? (x.followups || 0) + 1 : x.followups || 0,
        messages: [...(x.messages || []), msgRec], pending: null,
      }));
    } catch (e) {
      setMsg(e.code === "not_connected" ? "Connect Gmail first (Setup tab)." : e.message);
    }
    flag(l.id, false);
  }

  async function markDone(l) {
    try { await navigator.clipboard.writeText((l.draft.subject ? l.draft.subject + "\n\n" : "") + l.draft.body); } catch {}
    window.open(l.url || (l.website && "https://" + host(l.website)), "_blank", "noopener");
    upd(l.id, { status: l.kind === "reply" ? "sent" : "applied", sentAt: new Date().toISOString() });
  }

  async function sync() {
    const threads = tracking.filter((l) => l.threadId && !["stopped", "lost", "won"].includes(l.status)).map((l) => ({ id: l.id, threadId: l.threadId, lastSeen: l.lastSeen }));
    if (!threads.length) { setMsg("No email threads to check yet."); return; }
    flag("sync", true); setMsg("");
    try {
      const { results } = await post("/api/agent/sync", { threads });
      let fresh = 0;
      results.forEach((r) => {
        if (r.error) return;
        if (r.newReply) fresh++;
        upd(r.id, (x) => ({
          replies: r.replies, lastSeen: r.lastSeen, messages: r.messages,
          ...(r.analysis ? { analysis: r.analysis, status: r.analysis.stop ? "stopped" : r.analysis.category === "auto_reply" ? x.status : "replied" } : {}),
        }));
      });
      setMsg(fresh ? `${fresh} new repl${fresh === 1 ? "y" : "ies"}.` : "No new replies.");
    } catch (e) { setMsg(e.message); }
    flag("sync", false);
  }

  function importPipeline() {
    const rows = load(PIPE, []);
    const have = new Set(st.leads.map((l) => l.website || l.company));
    const add = rows.filter((r) => !have.has(r.website || r.company)).map((r) => ({
      id: uid(), company: r.company, website: r.website, email: r.email, location: r.location, signal: r.signal, why_fit: r.why_fit,
      source: "Pipeline", status: "new", added: new Date().toISOString(), kind: r.email || r.website ? "email" : "apply",
    }));
    setSt((s) => ({ ...s, leads: [...add, ...s.leads] }));
    setMsg(`Imported ${add.length} lead${add.length === 1 ? "" : "s"} from your pipeline.`);
  }

  function addManual(text) {
    const lines = text.split(/\n+/).map((s) => s.trim()).filter(Boolean);
    const add = lines.map((line) => {
      const email = (line.match(/[^\s,]+@[^\s,]+\.[a-z]{2,}/i) || [])[0] || "";
      const site = (line.match(/(https?:\/\/)?([a-z0-9-]+\.)+[a-z]{2,}(\/\S*)?/i) || [])[0] || "";
      const url = /reddit\.com|x\.com|twitter\.com|linkedin\.com\/jobs|\/jobs?\//i.test(site) ? site : "";
      return { id: uid(), company: host(site) || line.slice(0, 60), website: url ? "" : (email ? "" : site), email, url, source: url ? (host(url).includes("reddit") ? "Reddit" : host(url).includes("x.com") || host(url).includes("twitter") ? "X (Twitter)" : "Job post") : "Manual", status: "new", added: new Date().toISOString() };
    }).map((l) => ({ ...l, kind: kindFor(l) }));
    setSt((s) => ({ ...s, leads: [...add, ...s.leads] }));
    setMsg(`Added ${add.length} lead${add.length === 1 ? "" : "s"}.`);
  }

  // ---- stats ----
  const stats = useMemo(() => {
    const emailed = st.leads.filter((l) => l.kind === "email" && l.sentAt);
    const replied = emailed.filter((l) => l.replies);
    const by = (k) => Object.entries(st.leads.filter((l) => l.sentAt).reduce((m, l) => { const g = l[k] || "Other"; m[g] = m[g] || { sent: 0, replied: 0 }; m[g].sent++; if (l.replies) m[g].replied++; return m; }, {}));
    return {
      emailed: emailed.length, replied: replied.length, rate: emailed.length ? Math.round((replied.length / emailed.length) * 100) : 0,
      interested: st.leads.filter((l) => ["interested", "question", "referral"].includes(l.analysis?.category)).length,
      applied: st.leads.filter((l) => l.status === "applied").length, won: st.leads.filter((l) => l.status === "won").length,
      bySource: by("source"), byKind: by("kind"),
    };
  }, [st.leads]);

  if (!ready) return <div className="status"><Loader2 className="spin" size={18} /> Loading…</div>;
  const p = st.profile;
  const profileMissing = !p.name || !p.services;

  return (
    <>
      <div className="chips agent-tabs">
        {[["queue", `Queue (${queue.length})`, ListChecks], ["tracking", `Sent & replies (${tracking.length})`, Inbox], ["add", "Add leads", Plus], ["stats", "Stats", BarChart3], ["setup", "Setup", Settings]].map(([id, label, Ic]) => (
          <button key={id} type="button" className={"chip" + (tab === id ? " on" : "")} onClick={() => setTab(id)}><Ic size={13} /> {label}</button>
        ))}
      </div>
      {gmail && !gmail.connected && tab !== "setup" && <div className="errbox" style={{ margin: "12px 0" }}><AlertTriangle size={16} /> Gmail isn't connected — open <b style={{ margin: "0 4px" }}>Setup</b> to connect it before sending emails.</div>}
      {profileMissing && tab === "queue" && <div className="errbox" style={{ margin: "12px 0" }}><AlertTriangle size={16} /> Fill in your name and services in <b style={{ margin: "0 4px" }}>Setup</b> so drafts sound like you.</div>}
      {msg && <div className="fine" style={{ margin: "10px 0", color: "var(--gold)" }}>{msg}</div>}

      {tab === "setup" && (
        <div className="panel">
          <div className="label"><Mail size={13} /> Gmail</div>
          {!gmail ? <Loader2 className="spin" size={16} /> : !gmail.app ? (
            <p className="fine">Add <code>GOOGLE_CLIENT_ID</code> and <code>GOOGLE_CLIENT_SECRET</code> in Vercel first (see the setup steps), then reload this page.</p>
          ) : gmail.connected ? (
            <p className="fine" style={{ color: gmail.mismatch ? "var(--red)" : "var(--green)" }}>{gmail.mismatch ? "⚠ " : "✓ "}Connected as <b>{gmail.email}</b>{gmail.mismatch ? " — not the expected account, reconnect." : ""}</p>
          ) : (
            <a className="go" href="/api/gmail/auth" style={{ textDecoration: "none", width: "auto", display: "inline-flex", padding: "11px 18px" }}><Mail size={16} /> Connect Gmail</a>
          )}
          <div className="label" style={{ marginTop: 22 }}><Settings size={13} /> About you (used in every draft)</div>
          <div className="agent-form">
            {[["name", "Your name", "Sufyan"], ["business", "Business", "Swift Labs"], ["services", "What you offer", "Next.js websites, mobile apps, AI integrations, UI/UX"], ["offer", "Proof / results (only real ones)", "e.g. built X for Y; discovery sprints from $1,500"], ["portfolio", "Portfolio link", "https://…"], ["calendar", "Booking link (optional)", "https://calendly.com/…"], ["signature", "Signature", "Sufyan, Swift Labs"]].map(([k, label, ph]) => (
              <label key={k} className="calc-f"><span className="label">{label}</span><input className="inp" value={p[k] || ""} placeholder={ph} onChange={(e) => setProfile(k, e.target.value)} /></label>
            ))}
          </div>
          <p className="fine">Saved in this browser. The agent never invents clients or results — it only uses what you write here.</p>
        </div>
      )}

      {tab === "add" && <AddLeads onImport={importPipeline} onAdd={addManual} />}

      {tab === "queue" && (
        <>
          <div className="board-tools">
            <span className="count">{queue.filter((l) => l.status === "new").length} TO DRAFT · {queue.filter((l) => l.status === "drafted").length} READY</span>
            <button className="btn" onClick={draftAll} disabled={!queue.some((l) => l.status === "new") || Object.values(busy).some(Boolean)}><Sparkles size={15} /> Research & draft next 10</button>
          </div>
          {queue.length === 0 && <div className="pipe-empty">Nothing in the queue. Add leads from the <a href="/leads">Fresh leads</a> page (→ agent buttons), your pipeline, or paste websites in <b>Add leads</b>.</div>}
          {queue.map((l) => (
            <div className="card" key={l.id}>
              <div className="card-top">
                <div>
                  <div className="cname">{l.company || host(l.website) || l.title?.slice(0, 60)}</div>
                  <div className="cmeta">
                    <span className={"kind kind-" + l.kind}>{l.kind === "email" ? "Email" : l.kind === "apply" ? "Apply" : "Reply"}</span>
                    {l.source && <span>{l.source}</span>}
                    {l.website && <span><a href={"https://" + host(l.website)} target="_blank" rel="noopener nofollow">{host(l.website)}</a></span>}
                    {l.url && <span><a href={l.url} target="_blank" rel="noopener nofollow">post <ExternalLink size={11} /></a></span>}
                    {l.research?.team?.[0] && <span>👤 {l.research.team[0].name}</span>}
                  </div>
                </div>
                <button className="del" onClick={() => remove(l.id)} title="Remove"><Trash2 size={15} /></button>
              </div>
              {l.title && <div className="note">{l.title}</div>}
              {l.research?.signals?.length > 0 && <div className="fine">Site issues: {l.research.signals.join(" · ")}</div>}
              {l.status === "new" ? (
                <div className="actions"><button className="btn" onClick={() => draft(l)} disabled={!!busy[l.id]}>{busy[l.id] ? <><Loader2 className="spin" size={15} /> Researching…</> : <><Sparkles size={15} /> Research & draft</>}</button></div>
              ) : (
                <div className="agent-draft">
                  {l.kind === "email" && <input className="inp" value={l.draft.to} placeholder="recipient@company.com" onChange={(e) => upd(l.id, { draft: { ...l.draft, to: e.target.value } })} />}
                  {l.kind !== "reply" && <input className="inp" value={l.draft.subject} onChange={(e) => upd(l.id, { draft: { ...l.draft, subject: e.target.value } })} />}
                  <textarea className="inp" rows={8} value={l.draft.body} onChange={(e) => upd(l.id, { draft: { ...l.draft, body: e.target.value } })} />
                  {l.kind === "email" && !l.draft.to && <div className="fine" style={{ color: "var(--red)" }}>No public email found on their site — add one, or switch to applying/contacting via their website.</div>}
                  <div className="actions">
                    {l.kind === "email" ? (
                      <button className="go" style={{ width: "auto", padding: "11px 18px" }} onClick={() => sendEmail(l, l.draft)} disabled={!!busy[l.id] || !l.draft.to}>{busy[l.id] === "send" ? <><Loader2 className="spin" size={16} /> Sending…</> : <><Send size={16} /> Approve & send from Gmail</>}</button>
                    ) : (
                      <button className="go" style={{ width: "auto", padding: "11px 18px" }} onClick={() => markDone(l)}><ExternalLink size={16} /> Copy & open {l.kind === "apply" ? "application" : "post"} — mark done</button>
                    )}
                    <button className="btn" onClick={() => draft(l)} disabled={!!busy[l.id]}><RefreshCw size={14} /> Rewrite</button>
                    <CopyButton text={(l.draft.subject ? l.draft.subject + "\n\n" : "") + l.draft.body} />
                  </div>
                </div>
              )}
            </div>
          ))}
        </>
      )}

      {tab === "tracking" && (
        <>
          <div className="board-tools">
            <span className="count">{tracking.filter(followUpDue).length} FOLLOW-UPS DUE · {tracking.filter((l) => l.analysis && ["interested", "question", "referral"].includes(l.analysis.category)).length} WARM</span>
            <button className="btn" onClick={sync} disabled={busy.sync}>{busy.sync ? <Loader2 className="spin" size={15} /> : <RefreshCw size={15} />} Check replies</button>
          </div>
          {tracking.length === 0 && <div className="pipe-empty">Nothing sent yet.</div>}
          {[...tracking].sort((a, b) => (b.lastSeen || b.lastSentAt || b.sentAt || "").localeCompare(a.lastSeen || a.lastSentAt || a.sentAt || "")).map((l) => (
            <div className="card" key={l.id}>
              <div className="card-top">
                <div>
                  <div className="cname">{l.company || host(l.website)}</div>
                  <div className="cmeta">
                    <span className={"stat stat-" + l.status}>{STATUS_LABEL[l.status]}</span>
                    {l.analysis && <span className={"stat cat-" + l.analysis.category}>{l.analysis.category.replace("_", " ")}</span>}
                    {l.draft?.to && <span>{l.draft.to}</span>}
                    {l.sentAt && <span>sent {new Date(l.sentAt).toLocaleDateString()}</span>}
                    {l.followups > 0 && <span>{l.followups} follow-up{l.followups > 1 ? "s" : ""}</span>}
                    {followUpDue(l) && <span className="nosite">follow-up due</span>}
                  </div>
                </div>
                <select className="inp" style={{ width: "auto" }} value={l.status} onChange={(e) => upd(l.id, { status: e.target.value })}>
                  {Object.entries(STATUS_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
              </div>
              {l.skipReason && <div className="signal muted"><AlertTriangle size={14} /><span>Skipped by the agent: {l.skipReason}</span></div>}
              {l.analysis?.summary && <div className="signal"><Inbox size={14} /><span><b>Their reply:</b> {l.analysis.summary}</span></div>}
              {l.messages?.length > 0 && (
                <details className="faq" style={{ marginTop: 10 }}><summary>Conversation ({l.messages.length})</summary>
                  {l.messages.map((m, i) => <div key={i} className="msgtext" style={{ borderTop: "1px solid var(--line)" }}><b>{m.fromMe ? "You" : "Them"}</b> · {new Date(m.date).toLocaleString()}{"\n"}{m.text}</div>)}
                </details>
              )}
              {l.pending ? (
                <div className="agent-draft">
                  <textarea className="inp" rows={6} value={l.pending.body} onChange={(e) => upd(l.id, { pending: { ...l.pending, body: e.target.value } })} />
                  <div className="actions">
                    <button className="go" style={{ width: "auto", padding: "11px 18px" }} disabled={!!busy[l.id]} onClick={() => {
                      const last = [...(l.messages || [])].reverse().find((m) => m.messageId);
                      sendEmail(l, { to: l.draft.to, subject: "Re: " + (l.draft.subject || "").replace(/^re:\s*/i, ""), body: l.pending.body, threadId: l.threadId, inReplyTo: last?.messageId || l.messageId, followup: l.pending.type });
                    }}>{busy[l.id] === "send" ? <Loader2 className="spin" size={16} /> : <Send size={16} />} Approve & send in thread</button>
                    <button className="btn" onClick={() => upd(l.id, { pending: null })}>Discard</button>
                  </div>
                </div>
              ) : l.kind === "email" && l.threadId && !["stopped", "lost", "won"].includes(l.status) && (
                <div className="actions">
                  {l.replies > 0 && <button className="btn" onClick={() => draft(l, "response")} disabled={!!busy[l.id]}><Sparkles size={15} /> Draft response</button>}
                  {followUpDue(l) && <button className="btn" onClick={() => draft(l, "followup")} disabled={!!busy[l.id]}><Sparkles size={15} /> Draft follow-up</button>}
                </div>
              )}
            </div>
          ))}
        </>
      )}

      {tab === "stats" && (
        <div className="panel">
          <div className="calc-row">
            <div><div className="label">Emails sent</div><div className="calc-m">{stats.emailed}</div></div>
            <div><div className="label">Replied</div><div className="calc-m">{stats.replied} <small className="fine">({stats.rate}%)</small></div></div>
            <div><div className="label">Warm (interested / questions)</div><div className="calc-m">{stats.interested}</div></div>
          </div>
          <div className="calc-row">
            <div><div className="label">Applications</div><div className="calc-m">{stats.applied}</div></div>
            <div><div className="label">Won</div><div className="calc-m">{stats.won}</div></div>
            <div />
          </div>
          {stats.bySource.length > 0 && (
            <div className="ptable" style={{ marginTop: 16 }}><table><thead><tr><th>Source</th><th>Sent</th><th>Replied</th><th>Reply rate</th></tr></thead>
              <tbody>{stats.bySource.map(([k, v]) => <tr key={k}><td>{k}</td><td>{v.sent}</td><td>{v.replied}</td><td>{Math.round((v.replied / v.sent) * 100)}%</td></tr>)}</tbody></table></div>
          )}
          <p className="fine">Rule of thumb: if a source gets 0 replies after 20 sends, change the message or the source. Keep under ~20 new emails a day.</p>
        </div>
      )}
    </>
  );
}

function AddLeads({ onImport, onAdd }) {
  const [text, setText] = useState("");
  return (
    <div className="panel">
      <div className="label">From your finder pipeline</div>
      <button className="btn" onClick={onImport}><Plus size={15} /> Import saved pipeline leads</button>
      <div className="label" style={{ marginTop: 20 }}>Paste leads — one per line (website, email, or a Reddit / X / job-post link)</div>
      <textarea className="inp" rows={6} value={text} onChange={(e) => setText(e.target.value)} placeholder={"smilecaredental.pk\nhello@northgate-plumbing.co.uk\nhttps://www.reddit.com/r/forhire/comments/…\nhttps://www.linkedin.com/jobs/view/…"} />
      <div className="actions"><button className="btn" onClick={() => { onAdd(text); setText(""); }} disabled={!text.trim()}><Plus size={15} /> Add to queue</button></div>
      <p className="fine">Tip: on <a href="/leads">Fresh leads</a>, each row has a <b>→ agent</b> button while you're signed in as the owner.</p>
    </div>
  );
}
