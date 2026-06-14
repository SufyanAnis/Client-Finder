"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Search, Loader2, Copy, Check, MapPin, Building2, Sparkles, ArrowRight,
  Mail, Phone, Linkedin, MessageCircle, Target, RotateCcw, Globe, Zap,
  AlertTriangle, Radar, BookmarkPlus, BookmarkCheck, Trash2, FileSpreadsheet
} from "lucide-react";
import * as XLSX from "xlsx";

const GEOS = ["United Kingdom", "Ireland", "United States", "Australia", "UAE", "Canada", "Saudi Arabia", "Pakistan"];
const SIZES = ["Startup (1-50)", "Mid-market (51-500)", "Enterprise (500+)"];
const SERVICES = [
  "Web build (Next.js / React)", "Mobile app", "AI integration & agents",
  "Enterprise (SAP / Apigee / Jira)", "SEO & growth marketing", "Design system / UI-UX", "Game UI/UX"
];
const CHANNELS = [{ id: "Email", icon: Mail }, { id: "LinkedIn", icon: Linkedin }, { id: "WhatsApp", icon: MessageCircle }];
const LOADING = ["Scanning the open web...", "Shortlisting real companies...", "Reading buying signals...", "Scoring fit against your ICP..."];
const STORE_KEY = "swiftlabs_pipeline_v1";

const scoreColor = (n) => (n >= 80 ? "var(--green)" : n >= 60 ? "var(--gold)" : "var(--muted)");
const cleanDomain = (w = "") => w.replace(/^https?:\/\//, "").replace(/\/$/, "");

export default function LeadApp() {
  const [geo, setGeo] = useState("United Kingdom");
  const [niche, setNiche] = useState("");
  const [size, setSize] = useState(SIZES[0]);
  const [service, setService] = useState(SERVICES[0]);
  const [channel, setChannel] = useState("Email");
  const [count, setCount] = useState(5);

  const [loading, setLoading] = useState(false);
  const [loadIdx, setLoadIdx] = useState(0);
  const [error, setError] = useState("");
  const [leads, setLeads] = useState([]);
  const timer = useRef(null);

  const [pipeline, setPipeline] = useState([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORE_KEY);
      if (raw) {
        const rows = JSON.parse(raw);
        if (Array.isArray(rows)) setPipeline(rows.map((r) => ({ ...r, drafting: false, draftError: false })));
      }
    } catch {}
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) {
      // drafting/draftError are transient request state — persisting them bricks rows on reload
      try { localStorage.setItem(STORE_KEY, JSON.stringify(pipeline.map(({ drafting, draftError, ...r }) => r))); } catch {}
    }
  }, [pipeline, hydrated]);

  useEffect(() => {
    if (loading) timer.current = setInterval(() => setLoadIdx((i) => (i + 1) % LOADING.length), 1600);
    else clearInterval(timer.current);
    return () => clearInterval(timer.current);
  }, [loading]);

  const findLeads = useCallback(async () => {
    setLoading(true); setError(""); setLeads([]); setLoadIdx(0);
    try {
      const res = await fetch("/api/find-leads", {
        method: "POST", headers: { "content-type": "application/json" },
        body: JSON.stringify({ geo, niche, size, service, count }),
      });
      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error || "Request failed");
      // stamp a stable id plus the targeting the search actually ran with,
      // so later saves/drafts don't pick up whatever the chips say at that moment
      setLeads((data.leads || []).map((p) => ({
        ...p, _id: crypto.randomUUID(), service, channel, message: null, drafting: false, draftError: false,
      })));
    } catch (err) {
      setError("Couldn't pull leads this time (" + (err.message || "error") + "). Try again, narrow the niche, or lower the lead count.");
    } finally { setLoading(false); }
  }, [geo, niche, size, service, count]);

  // updates are keyed on a stable row id, never on array index — the list can be
  // prepended to or filtered while the request is in flight
  async function draftMessage(rowId, target = "leads") {
    const idKey = target === "leads" ? "_id" : "id";
    const list = target === "leads" ? leads : pipeline;
    const setList = target === "leads" ? setLeads : setPipeline;
    const L = list.find((x) => x[idKey] === rowId);
    if (!L) return;
    // a card draft follows the currently selected channel chip (matching the button label);
    // a pipeline row keeps the channel it was saved with
    const useChannel = target === "leads" ? channel : (L.channel || channel);
    const useService = L.service || service;
    setList((xs) => xs.map((x) => (x[idKey] === rowId ? { ...x, drafting: true, draftError: false } : x)));
    try {
      const res = await fetch("/api/draft", {
        method: "POST", headers: { "content-type": "application/json" },
        body: JSON.stringify({
          company: L.company, location: L.location, why_fit: L.why_fit,
          signal: L.signal, contact_role: L.contact_role, service: useService, channel: useChannel,
        }),
      });
      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error || "error");
      setList((xs) => xs.map((x) => (x[idKey] === rowId ? { ...x, message: data.message, channel: useChannel, drafting: false, draftError: false } : x)));
    } catch {
      // never store error text in message — a truthy message reads as a finished draft
      setList((xs) => xs.map((x) => (x[idKey] === rowId ? { ...x, drafting: false, draftError: true } : x)));
    }
  }

  function saveToPipeline(leadId) {
    const L = leads.find((x) => x._id === leadId);
    if (!L) return;
    // normalize the id the same way the stored website is normalized, or
    // "acme.com" and "https://acme.com" dedupe as different companies
    const id = (cleanDomain(L.website) || (L.company || "").trim().toLowerCase()) + "|" + (L.service || service);
    const markSaved = () => setLeads((xs) => xs.map((x) => (x._id === leadId ? { ...x, saved: true } : x)));
    if (pipeline.some((p) => p.id === id)) { markSaved(); return; }
    setPipeline((p) => [
      {
        id,
        company: L.company, website: cleanDomain(L.website), location: L.location || "",
        contact_role: L.contact_role || "", email: L.email || "", phone: L.phone || "",
        linkedin: L.linkedin || "", needs: (L.service || service) + (L.why_fit ? " — " + L.why_fit : ""),
        fit_score: L.fit_score, signal: L.signal || "", why_fit: L.why_fit || "",
        channel: L.channel || channel, service: L.service || service,
        message: L.message || "", added: new Date().toISOString().slice(0, 10), drafting: false,
      },
      ...p,
    ]);
    markSaved();
  }

  const updateRow = (id, field, val) => setPipeline((p) => p.map((r) => (r.id === id ? { ...r, [field]: val } : r)));
  const removeRow = (id) => setPipeline((p) => p.filter((r) => r.id !== id));

  function exportExcel() {
    if (!pipeline.length) return;
    const rows = pipeline.map((r) => ({
      Company: r.company, Website: r.website, Location: r.location,
      "Contact Role": r.contact_role, Email: r.email, Phone: r.phone, LinkedIn: r.linkedin,
      "Needs / What they want": r.needs, "Fit Score": r.fit_score, "Why now": r.signal,
      Channel: r.channel, "Outreach Message": r.message, Added: r.added,
    }));
    const ws = XLSX.utils.json_to_sheet(rows);
    ws["!cols"] = [
      { wch: 22 }, { wch: 24 }, { wch: 18 }, { wch: 18 }, { wch: 26 }, { wch: 16 },
      { wch: 30 }, { wch: 38 }, { wch: 9 }, { wch: 42 }, { wch: 10 }, { wch: 55 }, { wch: 12 },
    ];
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Leads");
    XLSX.writeFile(wb, `swiftlabs-leads-${new Date().toISOString().slice(0, 10)}.xlsx`);
  }

  return (
    <>
      <div className="panel">
        <div className="field">
          <div className="label"><Globe size={13} />Target geography</div>
          <div className="chips">
            {GEOS.map((g) => <button key={g} className={"chip" + (geo === g ? " on" : "")} onClick={() => setGeo(g)}>{g}</button>)}
          </div>
        </div>

        <div className="row">
          <div className="field">
            <div className="label"><Building2 size={13} />Industry / niche</div>
            <input className="inp" value={niche} placeholder="e.g. fintech, halal food brands, SaaS, clinics..." onChange={(e) => setNiche(e.target.value)} />
          </div>
          <div className="field">
            <div className="label"><Target size={13} />Company size</div>
            <div className="chips">
              {SIZES.map((s) => <button key={s} className={"chip" + (size === s ? " on" : "")} onClick={() => setSize(s)}>{s}</button>)}
            </div>
          </div>
        </div>

        <div className="field">
          <div className="label"><Sparkles size={13} />Service to lead with</div>
          <div className="chips">
            {SERVICES.map((s) => <button key={s} className={"chip" + (service === s ? " on" : "")} onClick={() => setService(s)}>{s}</button>)}
          </div>
        </div>

        <div className="row">
          <div className="field">
            <div className="label"><Mail size={13} />Outreach channel</div>
            <div className="chips">
              {CHANNELS.map(({ id, icon: Ic }) =>
                <button key={id} className={"chip" + (channel === id ? " on" : "")} onClick={() => setChannel(id)}><Ic size={13} />{id}</button>)}
            </div>
          </div>
          <div className="field">
            <div className="label"><Radar size={13} />How many leads</div>
            <div className="chips">
              {[3, 5, 8].map((n) => <button key={n} className={"chip" + (count === n ? " on" : "")} onClick={() => setCount(n)}>{n}</button>)}
            </div>
          </div>
        </div>

        <button className="go" onClick={findLeads} disabled={loading}>
          {loading ? <><Loader2 className="spin" size={18} /> Researching...</> : <><Search size={18} /> Find leads <ArrowRight size={17} /></>}
        </button>
      </div>

      {loading && <div className="status"><Loader2 className="spin" size={17} />{LOADING[loadIdx]}</div>}
      {error && <div className="status" style={{ paddingBottom: 0 }}><div className="errbox"><AlertTriangle size={18} />{error}</div></div>}

      {!loading && !error && leads.length === 0 && (
        <div className="empty"><Radar size={30} /><p>No leads yet. Set your targeting above and run the finder — results land here.</p></div>
      )}

      {leads.length > 0 && (
        <>
          <div className="shead"><h2>Prospects</h2><span className="count">{leads.length} FOUND · {geo.toUpperCase()}</span></div>
          {leads.map((L, i) => (
            <div className="card" key={L._id} style={{ animationDelay: i * 60 + "ms" }}>
              <div className="card-top">
                <div>
                  <div className="cname">{L.company}</div>
                  <div className="cmeta">
                    {L.website && <span><Globe size={12} /><a href={"https://" + cleanDomain(L.website)} target="_blank" rel="noreferrer">{cleanDomain(L.website)}</a></span>}
                    {L.location && <span><MapPin size={12} />{L.location}</span>}
                    {L.contact_role && <span><Target size={12} />{L.contact_role}</span>}
                    {L.email && <span><Mail size={12} /><a href={"mailto:" + L.email}>{L.email}</a></span>}
                    {L.phone && <span><Phone size={12} /><a href={"tel:" + L.phone.replace(/\s+/g, "")}>{L.phone}</a></span>}
                    {L.linkedin && <span><Linkedin size={12} /><a href={L.linkedin.startsWith("http") ? L.linkedin : "https://" + L.linkedin} target="_blank" rel="noreferrer">LinkedIn</a></span>}
                  </div>
                </div>
                <div className="score"><div className="n" style={{ color: scoreColor(L.fit_score) }}>{L.fit_score}</div><div className="l">fit</div></div>
              </div>

              {L.why_fit && <div className="note">{L.why_fit}</div>}
              {L.signal && <div className="signal"><Zap size={14} /><span><b>Why now:</b> {L.signal}</span></div>}

              <div className="actions">
                {!L.message && (
                  <button className="btn" onClick={() => draftMessage(L._id, "leads")} disabled={L.drafting}>
                    {L.drafting ? <><Loader2 className="spin" size={15} /> Drafting...</> : <><Sparkles size={15} /> {L.draftError ? "Retry draft" : `Draft ${channel}`}</>}
                  </button>
                )}
                <button className={"btn" + (L.saved ? " saved" : "")} onClick={() => saveToPipeline(L._id)} disabled={L.saved}>
                  {L.saved ? <><BookmarkCheck size={15} /> Saved</> : <><BookmarkPlus size={15} /> Save to pipeline</>}
                </button>
              </div>

              {L.draftError && !L.drafting && (
                <div className="signal" style={{ borderColor: "rgba(224,122,107,.35)", color: "#f0b5ab" }}>
                  <AlertTriangle size={14} /><span>Couldn't draft this one — hit retry.</span>
                </div>
              )}

              {L.message && (
                <div className="msgbox">
                  <div className="msgbar">
                    <span className="t">{L.channel || channel} draft</span>
                    <div style={{ display: "flex", gap: 14 }}>
                      <button className="linkbtn" onClick={() => draftMessage(L._id, "leads")}><RotateCcw size={13} /> redo</button>
                      <CopyBtn text={L.message} />
                    </div>
                  </div>
                  <div className="msgtext">{L.message}</div>
                </div>
              )}
            </div>
          ))}
        </>
      )}

      <div className="shead">
        <h2>Pipeline <span className="count" style={{ marginLeft: 8 }}>{pipeline.length} SAVED</span></h2>
        <button className="btn export" onClick={exportExcel} disabled={!pipeline.length}>
          <FileSpreadsheet size={15} /> Export to Excel
        </button>
      </div>

      <div className="pipe">
        {pipeline.length === 0 ? (
          <div className="pipe-empty">Saved leads appear here. Email / phone / LinkedIn cells are editable — fill in anything the research missed, then export the whole sheet to Excel.</div>
        ) : (
          <div className="tablewrap">
            <table>
              <thead>
                <tr>
                  <th>Company</th><th>Location</th><th>Role</th><th>Email</th><th>Phone</th>
                  <th>LinkedIn</th><th>Needs / wants</th><th>Fit</th><th>Message</th><th>Added</th><th></th>
                </tr>
              </thead>
              <tbody>
                {pipeline.map((r) => (
                  <tr key={r.id}>
                    <td>
                      <div className="co">{r.company}</div>
                      {r.website && <a href={"https://" + cleanDomain(r.website)} target="_blank" rel="noreferrer" style={{ color: "var(--gold-dim)", fontSize: 11.5 }}>{cleanDomain(r.website)}</a>}
                    </td>
                    <td>{r.location}</td>
                    <td>{r.contact_role}</td>
                    <td><input className="cell-inp" value={r.email || ""} placeholder="add email" onChange={(e) => updateRow(r.id, "email", e.target.value)} /></td>
                    <td><input className="cell-inp" value={r.phone || ""} placeholder="add phone" onChange={(e) => updateRow(r.id, "phone", e.target.value)} /></td>
                    <td><input className="cell-inp" value={r.linkedin || ""} placeholder="add linkedin" onChange={(e) => updateRow(r.id, "linkedin", e.target.value)} /></td>
                    <td><input className="cell-inp" value={r.needs || ""} onChange={(e) => updateRow(r.id, "needs", e.target.value)} /></td>
                    <td style={{ color: scoreColor(r.fit_score), fontWeight: 700, fontFamily: "'Bricolage Grotesque'" }}>{r.fit_score}</td>
                    <td style={{ minWidth: 150 }}>
                      {r.message
                        ? <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                            <span style={{ color: "var(--green)", fontSize: 12 }}>ready</span>
                            <CopyBtn text={r.message} small />
                          </div>
                        : <button className="linkbtn" style={r.draftError ? { color: "var(--red)" } : undefined} onClick={() => draftMessage(r.id, "pipeline")} disabled={r.drafting}>
                            {r.drafting ? <Loader2 className="spin" size={12} /> : <Sparkles size={12} />} {r.draftError ? "retry" : "draft"}
                          </button>}
                    </td>
                    <td style={{ whiteSpace: "nowrap", color: "var(--faint)", fontSize: 12 }}>{r.added}</td>
                    <td><button className="del" onClick={() => removeRow(r.id)} title="Remove"><Trash2 size={15} /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}

function CopyBtn({ text, small }) {
  const [done, setDone] = useState(false);
  async function go() {
    try { await navigator.clipboard.writeText(text); }
    catch {
      const ta = document.createElement("textarea"); ta.value = text; document.body.appendChild(ta);
      ta.select(); try { document.execCommand("copy"); } catch {} document.body.removeChild(ta);
    }
    setDone(true); setTimeout(() => setDone(false), 1800);
  }
  return (
    <button className={"linkbtn" + (done ? " done" : "")} onClick={go}>
      {done ? <Check size={small ? 12 : 13} /> : <Copy size={small ? 12 : 13} />} {done ? "copied" : "copy"}
    </button>
  );
}
