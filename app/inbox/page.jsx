"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Loader2, AlertTriangle, RefreshCw, FileSpreadsheet, Lock, Inbox } from "lucide-react";
import * as XLSX from "xlsx";

const TOKEN_KEY = "swiftlabs_admin_token";

export default function InboxPage() {
  const [token, setToken] = useState("");
  const [input, setInput] = useState("");
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [unlocked, setUnlocked] = useState(false);

  useEffect(() => {
    try { const t = localStorage.getItem(TOKEN_KEY); if (t) { setToken(t); setInput(t); } } catch {}
  }, []);

  const load = useCallback(async (tok) => {
    setLoading(true); setError("");
    try {
      const res = await fetch("/api/requests", { headers: { "x-admin-token": tok } });
      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error || "Failed to load");
      setRows(data.requests || []); setUnlocked(true);
      try { localStorage.setItem(TOKEN_KEY, tok); } catch {}
    } catch (err) {
      setError(err.message || "Failed to load"); setUnlocked(false);
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { if (token) load(token); }, [token, load]);

  function exportExcel() {
    if (!rows.length) return;
    const data = rows.map((r) => ({
      Date: (r.created_at || "").slice(0, 16).replace("T", " "),
      Name: r.name, Company: r.company, Email: r.email, Phone: r.phone,
      "Service wanted": r.service, Message: r.message,
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    ws["!cols"] = [{ wch: 17 }, { wch: 20 }, { wch: 20 }, { wch: 26 }, { wch: 18 }, { wch: 26 }, { wch: 55 }];
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Requests");
    XLSX.writeFile(wb, `swiftlabs-requests-${new Date().toISOString().slice(0, 10)}.xlsx`);
  }

  return (
    <>
      <div className="bg" />
      <div className="shell">
        <nav className="nav">
          <div className="nav-in">
            <div className="brand">
              <div className="logo"><Inbox size={17} /></div>
              <div>
                <b style={{ display: "block", lineHeight: 1 }}>Swift Labs</b>
                <span className="tag">Inbound requests</span>
              </div>
            </div>
            <a className="site" href="/">Lead finder
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 7h10v10"/><path d="M7 17 17 7"/></svg>
            </a>
          </div>
        </nav>

        <div className="wrap">
          <header className="hero" style={{ padding: "48px 0 18px" }}>
            <h1 style={{ fontSize: "clamp(28px,5vw,44px)" }}>Client <em>requests.</em></h1>
            <p>People who asked to work with Swift Labs via the request form. Export to Excel any time.</p>
          </header>

          {!unlocked ? (
            <form className="panel" onSubmit={(e) => { e.preventDefault(); setToken(input.trim()); }} style={{ maxWidth: 460 }}>
              <div className="field">
                <div className="label"><Lock size={13} /> Passphrase</div>
                <input className="inp" type="password" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Enter the inbox passphrase" autoFocus />
              </div>
              {error && <div className="errbox" style={{ marginBottom: 14 }}><AlertTriangle size={18} />{error}</div>}
              <button className="go" type="submit" disabled={loading || !input.trim()}>
                {loading ? <><Loader2 className="spin" size={18} /> Checking...</> : <>Unlock inbox</>}
              </button>
            </form>
          ) : (
            <>
              <div className="shead">
                <h2>Requests <span className="count" style={{ marginLeft: 8 }}>{rows.length} TOTAL</span></h2>
                <div style={{ display: "flex", gap: 9 }}>
                  <button className="btn" onClick={() => load(token)} disabled={loading}>
                    {loading ? <Loader2 className="spin" size={15} /> : <RefreshCw size={15} />} Refresh
                  </button>
                  <button className="btn export" onClick={exportExcel} disabled={!rows.length}>
                    <FileSpreadsheet size={15} /> Export to Excel
                  </button>
                </div>
              </div>

              <div className="pipe">
                {rows.length === 0 ? (
                  <div className="pipe-empty">No requests yet. Share your <a href="/request" style={{ color: "var(--gold-dim)" }}>request form</a> link and submissions will land here.</div>
                ) : (
                  <div className="tablewrap">
                    <table>
                      <thead>
                        <tr><th>Date</th><th>Name</th><th>Company</th><th>Email</th><th>Phone</th><th>Service</th><th>Message</th></tr>
                      </thead>
                      <tbody>
                        {rows.map((r) => (
                          <tr key={r.id || r.created_at + r.email}>
                            <td style={{ whiteSpace: "nowrap", color: "var(--faint)", fontSize: 12 }}>{(r.created_at || "").slice(0, 10)}</td>
                            <td><div className="co">{r.name}</div></td>
                            <td>{r.company}</td>
                            <td>{r.email && <a href={"mailto:" + r.email} style={{ color: "var(--gold-dim)" }}>{r.email}</a>}</td>
                            <td>{r.phone && <a href={"tel:" + r.phone.replace(/\s+/g, "")} style={{ color: "var(--gold-dim)" }}>{r.phone}</a>}</td>
                            <td>{r.service}</td>
                            <td style={{ maxWidth: 320, whiteSpace: "pre-wrap" }}>{r.message}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </>
          )}

          <footer className="foot">&copy; {new Date().getFullYear()} Swift Labs · Karachi.</footer>
        </div>
      </div>
    </>
  );
}
