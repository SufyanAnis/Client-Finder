"use client";

import { useState } from "react";
import { Loader2, AlertTriangle, FileSpreadsheet, Globe, Mail, Phone, MessageCircle, BookmarkPlus, BookmarkCheck, Sparkles } from "lucide-react";
import CopyButton from "./CopyButton";
import Paywall, { readKey } from "./Paywall";

const PIPE_KEY = "fmc_pipeline_v1";
const csvCell = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;

function downloadCsv(rows) {
  const head = Object.keys(rows[0]);
  const csv = [head.map(csvCell).join(","), ...rows.map((r) => head.map((h) => csvCell(r[h])).join(","))].join("\r\n");
  const url = URL.createObjectURL(new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8" }));
  const a = document.createElement("a");
  a.href = url; a.download = `website-extract-${new Date().toISOString().slice(0, 10)}.csv`; a.click();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

const host = (u) => { try { return new URL(u).hostname.replace(/^www\./, ""); } catch { return u; } };
const socialList = (s) => Object.entries(s || {}).filter(([, v]) => v);

// Save a result into the finder's pipeline (same browser storage the finder uses).
function saveToPipeline(r) {
  try {
    const rows = JSON.parse(localStorage.getItem(PIPE_KEY) || "[]");
    const id = host(r.url) + "|website";
    if (rows.some((x) => x.id === id)) return true;
    rows.unshift({
      id, company: r.name || host(r.url), website: host(r.url), location: r.address || r.ai?.location || "",
      contact_role: (r.ai?.team?.[0] && `${r.ai.team[0].name} (${r.ai.team[0].role || "team"})`) || "",
      email: r.emails[0] || "", phone: r.phones[0] || r.whatsapp[0] || "", linkedin: r.socials?.linkedin || "",
      needs: r.signals.join("; "), fit_score: null, signal: r.signals[0] || "", why_fit: r.ai?.what_they_do || "",
      channel: "Email", service: "", message: "", added: new Date().toISOString().slice(0, 10),
    });
    localStorage.setItem(PIPE_KEY, JSON.stringify(rows));
    return true;
  } catch { return false; }
}

export default function WebsiteExtractor() {
  const [urls, setUrls] = useState("");
  const [mode, setMode] = useState("lead");
  const [prompt, setPrompt] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [paywall, setPaywall] = useState("");
  const [results, setResults] = useState([]);
  const [note, setNote] = useState("");
  const [saved, setSaved] = useState({});

  async function run() {
    setBusy(true); setError(""); setPaywall(""); setResults([]); setNote("");
    try {
      const key = readKey();
      const res = await fetch("/api/extract", {
        method: "POST",
        headers: { "content-type": "application/json", ...(key ? { "x-fmc-key": key } : {}) },
        body: JSON.stringify({ urls, prompt: mode === "custom" ? prompt : "" }),
      });
      const d = await res.json().catch(() => ({}));
      if (d.code === "paywall") { setPaywall(d.error); return; }
      if (!res.ok || d.error) throw new Error(d.error || "Extraction failed");
      setResults(d.results || []);
      if (d.skipped) setNote(`Checked the first ${d.limit} sites — ${d.skipped} skipped (limit per run).`);
    } catch (e) { setError(e.message); }
    finally { setBusy(false); }
  }

  const ok = results.filter((r) => r.ok);
  return (
    <>
      <div className="panel">
        <div className="field">
          <div className="label"><Globe size={13} />Websites (one per line, up to 10)</div>
          <textarea className="inp" rows={5} value={urls} onChange={(e) => setUrls(e.target.value)} placeholder={"smilecaredental.pk\nhttps://example-bakery.com\nnorthgate-plumbing.co.uk"} />
        </div>
        <div className="field">
          <div className="label"><Sparkles size={13} />What to extract</div>
          <div className="chips">
            <button type="button" className={"chip" + (mode === "lead" ? " on" : "")} onClick={() => setMode("lead")}>Lead info (contacts, services, team, site issues)</button>
            <button type="button" className={"chip" + (mode === "custom" ? " on" : "")} onClick={() => setMode("custom")}>Custom — describe it</button>
          </div>
          {mode === "custom" && (
            <textarea className="inp" rows={2} style={{ marginTop: 9 }} value={prompt} maxLength={600} onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. Extract the menu prices, opening hours and delivery areas" />
          )}
        </div>
        <button className="go" type="button" onClick={run} disabled={busy || !urls.trim()}>
          {busy ? <><Loader2 className="spin" size={18} /> Reading websites…</> : <>Extract</>}
        </button>
        <div className="quota">Reads each site's homepage + contact/about pages. Contacts are copied exactly from the site — never guessed.</div>
      </div>

      {paywall && <Paywall message={paywall} />}
      {error && <div className="status"><div className="errbox"><AlertTriangle size={18} />{error}</div></div>}
      {note && <p className="fine">{note}</p>}

      {results.length > 0 && (
        <>
          <div className="shead">
            <h2>Results <span className="count" style={{ marginLeft: 8 }}>{ok.length}/{results.length} SITES READ</span></h2>
            <button className="btn export" disabled={!ok.length} onClick={() => downloadCsv(ok.map((r) => ({
              Name: r.name, Website: r.url, Emails: r.emails.join("; "), Phones: r.phones.join("; "), WhatsApp: r.whatsapp.join("; "),
              Facebook: r.socials.facebook, Instagram: r.socials.instagram, LinkedIn: r.socials.linkedin, X: r.socials.x,
              Address: r.address || r.ai?.location || "", "What they do": r.ai?.what_they_do || "", Services: (r.ai?.services || []).join("; "),
              Team: (r.ai?.team || []).map((t) => `${t.name}${t.role ? " (" + t.role + ")" : ""}`).join("; "),
              "Website issues": r.signals.join("; "), ...(r.ai && mode === "custom" ? { Extracted: JSON.stringify(r.ai) } : {}),
            })))}><FileSpreadsheet size={15} /> Export CSV</button>
          </div>
          {results.map((r) => (
            <div className="card" key={r.url}>
              {!r.ok ? (
                <div className="cname" style={{ fontSize: 15 }}>{host(r.url)} <span className="fine" style={{ marginLeft: 8 }}>couldn't read: {r.error}</span></div>
              ) : (
                <>
                  <div className="card-top">
                    <div>
                      <div className="cname">{r.name || host(r.url)}</div>
                      <div className="cmeta">
                        <span><Globe size={12} /><a href={r.url} target="_blank" rel="noopener nofollow">{host(r.url)}</a></span>
                        {r.emails.map((e) => <span key={e}><Mail size={12} /><a href={"mailto:" + e}>{e}</a></span>)}
                        {r.phones.map((p) => <span key={p}><Phone size={12} /><a href={"tel:" + p}>{p}</a></span>)}
                        {r.whatsapp.map((w) => <span key={w}><MessageCircle size={12} /><a href={"https://wa.me/" + w.replace(/\D/g, "")} target="_blank" rel="noopener">WhatsApp</a></span>)}
                        {socialList(r.socials).map(([k, v]) => <span key={k}><a href={v} target="_blank" rel="noopener nofollow">{k}</a></span>)}
                      </div>
                    </div>
                    <button className={"btn" + (saved[r.url] ? " saved" : "")} onClick={() => setSaved((s) => ({ ...s, [r.url]: saveToPipeline(r) }))} disabled={saved[r.url]}>
                      {saved[r.url] ? <><BookmarkCheck size={15} /> Saved</> : <><BookmarkPlus size={15} /> Save to pipeline</>}
                    </button>
                  </div>
                  {r.ai?.what_they_do && <div className="note">{r.ai.what_they_do}</div>}
                  {r.ai?.services?.length > 0 && <div className="fine" style={{ marginTop: 6 }}>Services: {r.ai.services.join(" · ")}</div>}
                  {r.ai?.team?.length > 0 && <div className="fine">Team: {r.ai.team.map((t) => `${t.name}${t.role ? " — " + t.role : ""}`).join(" · ")}</div>}
                  {r.signals.length > 0 && (
                    <div className="signal"><AlertTriangle size={14} /><span><b>Pitch angles:</b> {r.signals.join(" · ")}</span></div>
                  )}
                  {mode === "custom" && r.ai && (
                    <div className="msgbox">
                      <div className="msgbar"><span className="t">Extracted</span><CopyButton text={JSON.stringify(r.ai, null, 2)} /></div>
                      <div className="msgtext">{JSON.stringify(r.ai, null, 2)}</div>
                    </div>
                  )}
                  <div className="fine" style={{ marginTop: 8 }}>Read {r.pagesRead.length} page{r.pagesRead.length === 1 ? "" : "s"}: {r.pagesRead.map((p) => new URL(p).pathname).join(" · ")}</div>
                </>
              )}
            </div>
          ))}
        </>
      )}
    </>
  );
}
