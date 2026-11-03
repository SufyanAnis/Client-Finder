"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Search, Loader2, MapPin, Building2, Sparkles, ArrowRight,
  Mail, Phone, Linkedin, MessageCircle, Target, RotateCcw, Globe, Zap,
  AlertTriangle, Radar, BookmarkPlus, BookmarkCheck, Trash2, FileSpreadsheet,
  UserRound, ChevronDown, ExternalLink, ContactRound,
} from "lucide-react";
import * as XLSX from "xlsx";
import CopyButton from "./CopyButton";
import Paywall, { readKey, saveKey } from "./Paywall";
import { BUSINESS_TYPES } from "../lib/places";
import { SERVICE_IDS, GEOS, SIZES } from "../lib/services";

const CHANNELS = [{ id: "Email", icon: Mail }, { id: "LinkedIn", icon: Linkedin }, { id: "WhatsApp", icon: MessageCircle }];
const SOURCES = [{ id: "companies", label: "Companies (job posts, funding, launches)" }, { id: "reddit", label: "Reddit [Hiring] posts" }, { id: "maps", label: "Local businesses (map)" }];
const LOADING = ["Scanning the open web...", "Shortlisting real companies...", "Reading buying signals...", "Scoring fit..."];
const STORE_KEY = "fmc_pipeline_v1";
const LEGACY_KEY = "swiftlabs_pipeline_v1";
const ME_KEY = "fmc_me_v1";
const OWNER_KEY = "fmc_owner";
const TRIAL_KEY = "fmc_trial_used";
const TURNSTILE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "";

const scoreColor = (n) => (n >= 80 ? "var(--green)" : n >= 60 ? "var(--gold)" : "var(--muted)");
const cleanDomain = (w = "") => w.replace(/^https?:\/\//, "").replace(/\/$/, "");
const lsGet = (k) => { try { return localStorage.getItem(k); } catch { return null; } };
const lsSet = (k, v) => { try { localStorage.setItem(k, v); } catch {} };

// paywallOn: whether searches need credits after the free one (set by the server
// from whether payments are configured). Off = free daily limits.
export default function LeadApp({ paywallOn = false, mapsOn = false }) {
  const [service, setService] = useState(SERVICE_IDS[0]);
  const [customService, setCustomService] = useState("");
  const [geo, setGeo] = useState(GEOS[0]);
  const [customGeo, setCustomGeo] = useState("");
  const [niche, setNiche] = useState("");
  const [size, setSize] = useState(SIZES[0]);
  const [channel, setChannel] = useState("Email");
  const [source, setSource] = useState("companies");
  const [count, setCount] = useState(5);
  const [me, setMe] = useState({ name: "", business: "", offer: "" });
  const [meOpen, setMeOpen] = useState(false);
  const [owner, setOwner] = useState(false);
  const [licenseKey, setLicenseKey] = useState("");
  const [balance, setBalance] = useState(null);
  const [trialUsed, setTrialUsed] = useState(false);
  const [paywall, setPaywall] = useState(""); // message when a search needs credits

  const [loading, setLoading] = useState(false);
  const [loadIdx, setLoadIdx] = useState(0);
  const [error, setError] = useState("");
  const [leads, setLeads] = useState([]);
  const [ran, setRan] = useState(null); // { geo } of the last search, for the results header
  const timer = useRef(null);

  const [pipeline, setPipeline] = useState([]);
  const [hydrated, setHydrated] = useState(false);
  const turnstile = useTurnstile(TURNSTILE_KEY);

  const svc = (customService.trim() || service).slice(0, 80);
  const where = (customGeo.trim() || geo).slice(0, 80);

  useEffect(() => {
    try {
      const raw = lsGet(STORE_KEY) || lsGet(LEGACY_KEY);
      if (raw) {
        const rows = JSON.parse(raw);
        if (Array.isArray(rows)) setPipeline(rows.map((r) => ({ ...r, drafting: false, draftError: false })));
      }
      const m = JSON.parse(lsGet(ME_KEY) || "null");
      if (m && typeof m === "object") setMe({ name: m.name || "", business: m.business || "", offer: m.offer || "" });
    } catch {}
    setOwner(lsGet(OWNER_KEY) === "1");
    setTrialUsed(lsGet(TRIAL_KEY) === "1");
    const k = readKey();
    if (k) {
      setLicenseKey(k);
      fetch("/api/credits", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ key: k }) })
        .then((r) => r.json()).then((d) => { if (d.valid) setBalance(d.balance); else if (d.error && !/switched on/.test(d.error)) { saveKey(""); setLicenseKey(""); } })
        .catch(() => {});
    }

    // Prefill from links like /?service=SEO&niche=dental+clinics#finder
    const q = new URLSearchParams(window.location.search);
    const qs = q.get("service"), qn = q.get("niche"), qg = q.get("geo");
    if (qs) SERVICE_IDS.includes(qs) ? setService(qs) : setCustomService(qs.slice(0, 80));
    if (qn) setNiche(qn.slice(0, 120));
    if (qg) GEOS.includes(qg) ? setGeo(qg) : setCustomGeo(qg.slice(0, 80));
    setHydrated(true);
  }, []);

  useEffect(() => {
    // drafting/draftError/looking are transient request state — persisting them bricks rows on reload
    if (hydrated) lsSet(STORE_KEY, JSON.stringify(pipeline.map(({ drafting, draftError, ...r }) => r)));
  }, [pipeline, hydrated]);

  useEffect(() => { if (hydrated) lsSet(ME_KEY, JSON.stringify(me)); }, [me, hydrated]);

  useEffect(() => {
    if (loading) timer.current = setInterval(() => setLoadIdx((i) => (i + 1) % LOADING.length), 1600);
    else clearInterval(timer.current);
    return () => clearInterval(timer.current);
  }, [loading]);

  const noteQuota = (data) => {
    if (typeof data?.balance === "number") setBalance(data.balance);
    if (typeof data?.owner === "boolean") { setOwner(data.owner); lsSet(OWNER_KEY, data.owner ? "1" : "0"); }
    if (data?.trial) { setTrialUsed(true); lsSet(TRIAL_KEY, "1"); }
  };
  // every API call carries the license key, if there is one
  const headers = () => ({ "content-type": "application/json", ...(licenseKey ? { "x-fmc-key": licenseKey } : {}) });
  const onKey = (k, bal) => { setLicenseKey(k); setBalance(bal); setPaywall(""); setError(""); };

  const findLeads = useCallback(async () => {
    if (TURNSTILE_KEY && !licenseKey && !turnstile.token) { setError("Please complete the quick human check above the button first."); return; }
    setLoading(true); setError(""); setPaywall(""); setLeads([]); setLoadIdx(0);
    try {
      const res = await fetch("/api/find-leads", {
        method: "POST", headers: headers(),
        body: JSON.stringify({ source, geo: where, niche, size, service: svc, count, turnstile: turnstile.token }),
      });
      const data = await res.json().catch(() => ({}));
      noteQuota(data);
      if (data.code === "paywall") {
        setPaywall(data.error);
        if (!licenseKey) { setTrialUsed(true); lsSet(TRIAL_KEY, "1"); }
        return;
      }
      if (!res.ok || data.error) {
        const e = new Error(data.error || "Request failed"); e.code = data.code; throw e;
      }
      // stamp a stable id plus the targeting the search actually ran with,
      // so later saves/drafts don't pick up whatever the chips say at that moment
      setRan({ geo: where });
      setLeads((data.leads || []).map((p) => ({
        ...p, _id: crypto.randomUUID(), service: svc, channel: p.kind === "reddit" ? "Reddit" : channel, message: null, drafting: false, draftError: false,
      })));
    } catch (err) {
      setError(err.code === "limit" || err.code === "capacity" || err.code === "turnstile"
        ? err.message
        : "Couldn't pull leads this time (" + (err.message || "error") + "). Try again, broaden the niche, or ask for fewer leads.");
    } finally {
      setLoading(false);
      turnstile.reset();
    }
  }, [source, where, niche, size, svc, count, channel, turnstile, licenseKey]);

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
    const useChannel = L.kind === "reddit" || L.channel === "Reddit" ? "Reddit" : target === "leads" ? channel : (L.channel || channel);
    setList((xs) => xs.map((x) => (x[idKey] === rowId ? { ...x, drafting: true, draftError: false } : x)));
    try {
      const res = await fetch("/api/draft", {
        method: "POST", headers: headers(),
        body: JSON.stringify({
          company: L.company, location: L.location, why_fit: L.why_fit, signal: L.signal,
          contact_role: L.contact_role, service: L.service || svc, channel: useChannel, sender: me,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || data.error) throw new Error(data.error || "error");
      setList((xs) => xs.map((x) => (x[idKey] === rowId ? { ...x, message: data.message, channel: useChannel, drafting: false, draftError: false } : x)));
    } catch (e) {
      // never store error text in message — a truthy message reads as a finished draft
      setList((xs) => xs.map((x) => (x[idKey] === rowId ? { ...x, drafting: false, draftError: e.message || true } : x)));
    }
  }

  async function lookupContact(leadId) {
    const L = leads.find((x) => x._id === leadId);
    if (!L) return;
    const patch = (p) => setLeads((xs) => xs.map((x) => (x._id === leadId ? { ...x, ...p } : x)));
    patch({ looking: true, lookupNote: "" });
    try {
      const res = await fetch("/api/lookup-contact", {
        method: "POST", headers: headers(),
        body: JSON.stringify({ company: L.company, website: L.website, location: L.location }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || data.error) throw new Error(data.error || "Lookup failed");
      const c = data.contact || {};
      patch({
        looking: false, looked: true,
        email: L.email || c.email || "", phone: L.phone || c.phone || "", linkedin: L.linkedin || c.linkedin || "",
        lookupNote: data.found ? "" : "No public contact found — try their website's contact page.",
      });
    } catch (e) {
      patch({ looking: false, lookupNote: e.message || "Lookup failed" });
    }
  }

  function saveToPipeline(leadId) {
    const L = leads.find((x) => x._id === leadId);
    if (!L) return;
    // normalize the id the same way the stored website is normalized, or
    // "acme.com" and "https://acme.com" dedupe as different companies
    const id = (cleanDomain(L.website) || (L.company || "").trim().toLowerCase()) + "|" + (L.service || svc);
    const markSaved = () => setLeads((xs) => xs.map((x) => (x._id === leadId ? { ...x, saved: true } : x)));
    if (pipeline.some((p) => p.id === id)) { markSaved(); return; }
    setPipeline((p) => [
      {
        id,
        company: L.company, website: cleanDomain(L.website), location: L.location || "",
        contact_role: L.contact_role || "", email: L.email || "", phone: L.phone || "",
        linkedin: L.linkedin || "", needs: (L.service || svc) + (L.why_fit ? " — " + L.why_fit : ""),
        fit_score: L.fit_score, signal: L.signal || "", why_fit: L.why_fit || "", source: L.source || "",
        channel: L.channel || channel, service: L.service || svc,
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
      "Needs / What they want": r.needs, "Fit Score": r.fit_score, "Why now": r.signal, Source: r.source || "",
      Channel: r.channel, "Outreach Message": r.message, Added: r.added,
    }));
    const ws = XLSX.utils.json_to_sheet(rows);
    ws["!cols"] = [
      { wch: 22 }, { wch: 24 }, { wch: 18 }, { wch: 18 }, { wch: 26 }, { wch: 16 },
      { wch: 30 }, { wch: 38 }, { wch: 9 }, { wch: 42 }, { wch: 30 }, { wch: 10 }, { wch: 55 }, { wch: 12 },
    ];
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Leads");
    XLSX.writeFile(wb, `findmyclients-leads-${new Date().toISOString().slice(0, 10)}.xlsx`);
  }

  const counts = source === "maps" ? [10, 20] : owner ? [3, 5, 8] : [3, 5];
  // keep the selected count valid when switching source
  useEffect(() => { if (!counts.includes(count)) setCount(counts[0]); }, [source]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <div className="panel" id="finder">
        <div className="field">
          <div className="label"><Radar size={13} />Where to look</div>
          <div className="chips">
            {SOURCES.filter((s) => s.id !== "maps" || mapsOn).map((s) => (
              <button key={s.id} type="button" className={"chip" + (source === s.id ? " on" : "")} onClick={() => setSource(s.id)}>{s.label}</button>
            ))}
          </div>
          {source === "reddit" && <div className="me-note" style={{ marginTop: 8 }}>Finds this week's public Reddit posts from people hiring for your service. Location and company size don't apply. Browse everything for free on <a href="/leads">Fresh leads</a>.</div>}
          {source === "maps" && <div className="me-note" style={{ marginTop: 8 }}>Local businesses from map listings in one city, with phone and website where listed. Businesses with <b>no website</b> come first — perfect for web, SEO and design. Type a <b>city</b> under "Where are your clients?".</div>}
        </div>

        <div className="field">
          <div className="label"><Sparkles size={13} />What do you sell?</div>
          <div className="chips">
            {SERVICE_IDS.map((s) => (
              <button key={s} type="button" className={"chip" + (!customService && service === s ? " on" : "")}
                onClick={() => { setService(s); setCustomService(""); }}>{s}</button>
            ))}
          </div>
          <input className="inp" style={{ marginTop: 9 }} value={customService} maxLength={80}
            placeholder="…or type your own, e.g. Shopify development, podcast editing, HR consulting"
            onChange={(e) => setCustomService(e.target.value)} aria-label="Your service" />
        </div>

        <div className="field">
          <div className="label"><Globe size={13} />Where are your clients?</div>
          <div className="chips">
            {GEOS.map((g) => (
              <button key={g} type="button" className={"chip" + (!customGeo && geo === g ? " on" : "")}
                onClick={() => { setGeo(g); setCustomGeo(""); }}>{g}</button>
            ))}
          </div>
          <input className="inp" style={{ marginTop: 9 }} value={customGeo} maxLength={80}
            placeholder="…or a city / region, e.g. Manchester, Texas, Dubai"
            onChange={(e) => setCustomGeo(e.target.value)} aria-label="Location" />
        </div>

        <div className="row">
          <div className="field">
            <div className="label"><Building2 size={13} />{source === "maps" ? "Type of business" : "Industry / niche (optional)"}</div>
            {source === "maps" && (
              <div className="chips" style={{ marginBottom: 9 }}>
                {BUSINESS_TYPES.map((b) => (
                  <button key={b.id} type="button" className={"chip" + (niche === b.label ? " on" : "")} onClick={() => setNiche(b.label)}>{b.label}</button>
                ))}
              </div>
            )}
            <input className="inp" value={niche} maxLength={120} placeholder={source === "maps" ? "Pick one above" : "e.g. dental clinics, fintech, restaurants, SaaS..."} onChange={(e) => setNiche(e.target.value)} />
          </div>
          <div className="field">
            <div className="label"><Target size={13} />Company size</div>
            <div className="chips">
              {SIZES.map((s) => <button key={s} type="button" className={"chip" + (size === s ? " on" : "")} onClick={() => setSize(s)}>{s}</button>)}
            </div>
          </div>
        </div>

        <div className="row">
          <div className="field">
            <div className="label"><Mail size={13} />Outreach channel</div>
            <div className="chips">
              {CHANNELS.map(({ id, icon: Ic }) =>
                <button key={id} type="button" className={"chip" + (channel === id ? " on" : "")} onClick={() => setChannel(id)}><Ic size={13} />{id}</button>)}
            </div>
          </div>
          <div className="field">
            <div className="label"><Radar size={13} />How many leads</div>
            <div className="chips">
              {counts.map((n) => <button key={n} type="button" className={"chip" + (count === n ? " on" : "")} onClick={() => setCount(n)}>{n}</button>)}
            </div>
          </div>
        </div>

        <div className="field me">
          <button type="button" className="me-toggle" onClick={() => setMeOpen((o) => !o)} aria-expanded={meOpen}>
            <UserRound size={14} /> About you <span className="me-hint">{me.name ? `drafts sign off as ${me.name}` : "so drafts sound like you"}</span>
            <ChevronDown size={14} style={{ marginLeft: "auto", transform: meOpen ? "rotate(180deg)" : "none", transition: "transform .2s" }} />
          </button>
          {meOpen && (
            <div className="me-body">
              <div className="row">
                <input className="inp" value={me.name} maxLength={60} placeholder="Your name" onChange={(e) => setMe({ ...me, name: e.target.value })} />
                <input className="inp" value={me.business} maxLength={80} placeholder="Business / studio name (optional)" onChange={(e) => setMe({ ...me, business: e.target.value })} />
              </div>
              <textarea className="inp" rows={2} value={me.offer} maxLength={300}
                placeholder="One or two lines on what you offer and any proof, e.g. 'I build fast Shopify stores; recent work for two UK skincare brands.'"
                onChange={(e) => setMe({ ...me, offer: e.target.value })} />
              <div className="me-note">Saved only in this browser. Drafts never invent clients or results you didn't list here.</div>
            </div>
          )}
        </div>

        {TURNSTILE_KEY && <div ref={turnstile.ref} className="turnstile" />}

        <button className="go" type="button" onClick={findLeads} disabled={loading}>
          {loading ? <><Loader2 className="spin" size={18} /> Researching...</> : <><Search size={18} /> Find leads <ArrowRight size={17} /></>}
        </button>
        <div className="quota">
          {owner ? "Owner mode · unlimited"
            : !paywallOn ? "Free · no signup · a few searches per day"
            : licenseKey ? <>{balance === null ? "Key active" : `${balance} credit${balance === 1 ? "" : "s"} left`} · <a href="/pricing">top up</a></>
            : trialUsed ? <>Free search used · <a href="/pricing">get credits</a> from Rs 499</>
            : "Your first search is free · no signup"}
        </div>
      </div>

      {paywall && <Paywall message={paywall} onKey={onKey} />}

      <div aria-live="polite">
        {loading && <div className="status"><Loader2 className="spin" size={17} />{LOADING[loadIdx]}</div>}
        {error && <div className="status" style={{ paddingBottom: 0 }}><div className="errbox"><AlertTriangle size={18} />{error}</div></div>}
      </div>

      {!loading && !error && leads.length === 0 && (
        <div className="empty"><Radar size={30} /><p>No leads yet. Set your targeting above and run the finder — results land here.</p></div>
      )}

      {leads.length > 0 && (
        <>
          <div className="shead"><h2>Prospects</h2><span className="count">{leads.length} FOUND · {(ran?.geo || where).toUpperCase()}</span></div>
          {leads.map((L, i) => (
            <div className="card" key={L._id} style={{ animationDelay: i * 60 + "ms" }}>
              <div className="card-top">
                <div>
                  <div className="cname">{L.company}</div>
                  <div className="cmeta">
                    {L.website && <span><Globe size={12} /><a href={"https://" + cleanDomain(L.website)} target="_blank" rel="noopener nofollow">{cleanDomain(L.website)}</a></span>}
                    {L.location && <span><MapPin size={12} />{L.location}</span>}
                    {L.contact_role && <span><Target size={12} />{L.contact_role}</span>}
                    {L.email && <span><Mail size={12} /><a href={"mailto:" + L.email}>{L.email}</a></span>}
                    {L.phone && <span><Phone size={12} /><a href={"tel:" + L.phone.replace(/\s+/g, "")}>{L.phone}</a></span>}
                    {L.linkedin && <span><Linkedin size={12} /><a href={L.linkedin.startsWith("http") ? L.linkedin : "https://" + L.linkedin} target="_blank" rel="noopener nofollow">LinkedIn</a></span>}
                  </div>
                </div>
                <div className="score"><div className="n" style={{ color: scoreColor(L.fit_score) }}>{L.fit_score}</div><div className="l">fit</div></div>
              </div>

              {L.why_fit && <div className="note">{L.why_fit}</div>}
              {L.signal && (
                <div className="signal"><Zap size={14} /><span><b>Why now:</b> {L.signal}
                  {L.source && <> · <a className="src" href={L.source} target="_blank" rel="noopener nofollow">source <ExternalLink size={11} /></a></>}
                </span></div>
              )}

              <div className="actions">
                {!L.message && (
                  <button className="btn" onClick={() => draftMessage(L._id, "leads")} disabled={L.drafting}>
                    {L.drafting ? <><Loader2 className="spin" size={15} /> Drafting...</> : <><Sparkles size={15} /> {L.draftError ? "Retry draft" : L.kind === "reddit" ? "Draft Reddit reply" : `Draft ${channel}`}</>}
                  </button>
                )}
                {!L.kind && !L.looked && (!L.email || !L.phone) && (
                  <button className="btn" onClick={() => lookupContact(L._id)} disabled={L.looking}>
                    {L.looking ? <><Loader2 className="spin" size={15} /> Looking...</> : <><ContactRound size={15} /> Find contact</>}
                  </button>
                )}
                <button className={"btn" + (L.saved ? " saved" : "")} onClick={() => saveToPipeline(L._id)} disabled={L.saved}>
                  {L.saved ? <><BookmarkCheck size={15} /> Saved</> : <><BookmarkPlus size={15} /> Save to pipeline</>}
                </button>
              </div>

              {L.lookupNote && <div className="signal muted"><AlertTriangle size={14} /><span>{L.lookupNote}</span></div>}
              {L.draftError && !L.drafting && (
                <div className="signal" style={{ borderColor: "rgba(224,122,107,.35)", color: "#f0b5ab" }}>
                  <AlertTriangle size={14} /><span>{typeof L.draftError === "string" ? L.draftError : "Couldn't draft this one — hit retry."}</span>
                </div>
              )}

              {L.message && (
                <div className="msgbox">
                  <div className="msgbar">
                    <span className="t">{L.channel || channel} draft</span>
                    <div style={{ display: "flex", gap: 14 }}>
                      <button className="linkbtn" onClick={() => draftMessage(L._id, "leads")}><RotateCcw size={13} /> redo</button>
                      <CopyButton text={L.message} />
                    </div>
                  </div>
                  <div className="msgtext">{L.message}</div>
                </div>
              )}
            </div>
          ))}
          <p className="fine">Check every lead before you reach out: AI research can be wrong or out of date. Contact details shown are public company details only. Keep outreach personal, low-volume and easy to opt out of — see <a href="/guides/cold-outreach-laws">outreach laws</a>.</p>
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
          <div className="pipe-empty">Saved leads appear here, stored in this browser. Email / phone / LinkedIn cells are editable — fill in anything the research missed, then export the whole sheet to Excel.</div>
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
                      {r.website && <a href={"https://" + cleanDomain(r.website)} target="_blank" rel="noopener nofollow" style={{ color: "var(--gold-dim)", fontSize: 11.5 }}>{cleanDomain(r.website)}</a>}
                    </td>
                    <td>{r.location}</td>
                    <td>{r.contact_role}</td>
                    <td><input className="cell-inp" value={r.email || ""} placeholder="add email" onChange={(e) => updateRow(r.id, "email", e.target.value)} /></td>
                    <td><input className="cell-inp" value={r.phone || ""} placeholder="add phone" onChange={(e) => updateRow(r.id, "phone", e.target.value)} /></td>
                    <td><input className="cell-inp" value={r.linkedin || ""} placeholder="add linkedin" onChange={(e) => updateRow(r.id, "linkedin", e.target.value)} /></td>
                    <td><input className="cell-inp" value={r.needs || ""} onChange={(e) => updateRow(r.id, "needs", e.target.value)} /></td>
                    <td style={{ color: scoreColor(r.fit_score), fontWeight: 700, fontFamily: "var(--f-display)" }}>{r.fit_score}</td>
                    <td style={{ minWidth: 150 }}>
                      {r.message
                        ? <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                            <span style={{ color: "var(--green)", fontSize: 12 }}>ready</span>
                            <CopyButton text={r.message} small />
                          </div>
                        : <button className="linkbtn" style={r.draftError ? { color: "var(--red)" } : undefined} onClick={() => draftMessage(r.id, "pipeline")} disabled={r.drafting}>
                            {r.drafting ? <Loader2 className="spin" size={12} /> : <Sparkles size={12} />} {r.draftError ? "retry" : "draft"}
                          </button>}
                    </td>
                    <td style={{ whiteSpace: "nowrap", color: "var(--faint)", fontSize: 12 }}>{r.added}</td>
                    <td><button className="del" onClick={() => removeRow(r.id)} title="Remove" aria-label={`Remove ${r.company}`}><Trash2 size={15} /></button></td>
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

// Cloudflare Turnstile, explicit render. Inert when no site key is configured.
function useTurnstile(siteKey) {
  const ref = useRef(null);
  const widget = useRef(null);
  const [token, setToken] = useState("");

  useEffect(() => {
    if (!siteKey) return;
    const render = () => {
      if (!ref.current || widget.current !== null || !window.turnstile) return;
      widget.current = window.turnstile.render(ref.current, {
        sitekey: siteKey, theme: "dark",
        callback: (t) => setToken(t),
        "expired-callback": () => setToken(""),
        "error-callback": () => setToken(""),
      });
    };
    if (window.turnstile) { render(); return; }
    const s = document.createElement("script");
    s.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
    s.async = true; s.onload = render;
    document.head.appendChild(s);
  }, [siteKey]);

  const reset = useCallback(() => {
    if (siteKey && window.turnstile && widget.current !== null) { window.turnstile.reset(widget.current); setToken(""); }
  }, [siteKey]);

  return { ref, token, reset };
}
