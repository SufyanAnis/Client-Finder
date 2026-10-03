"use client";

import React, { useState } from "react";
import { Loader2, AlertTriangle, Lock, Mail, KeyRound } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit(e) {
    e.preventDefault();
    setLoading(true); setError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Sign-in failed.");
      const next = new URLSearchParams(window.location.search).get("next");
      window.location.href = next && next.startsWith("/") && !next.startsWith("//") ? next : "/";
    } catch (err) {
      setError(err.message || "Sign-in failed.");
      setLoading(false);
    }
  }

  return (
    <>
      <div className="bg" />
      <div className="shell">
        <nav className="nav">
          <div className="nav-in">
            <div className="brand">
              <div className="logo"><Lock size={16} /></div>
              <div>
                <b style={{ display: "block", lineHeight: 1 }}>Swift Labs</b>
                <span className="tag">Lead Finder</span>
              </div>
            </div>
            <a className="site" href="/request">Request services
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 7h10v10"/><path d="M7 17 17 7"/></svg>
            </a>
          </div>
        </nav>

        <div className="wrap">
          <header className="hero" style={{ padding: "58px 0 8px" }}>
            <div className="pill"><span className="dot" /> Private workspace</div>
            <h1 style={{ fontSize: "clamp(30px,5.4vw,48px)" }}>Sign <em>in.</em></h1>
            <p>This lead finder runs on Swift Labs&apos; own research credits, so it&apos;s owner-only. Looking to hire us instead? Use the <a href="/request" style={{ color: "var(--gold-dim)" }}>request form</a>.</p>
          </header>

          <form className="panel" onSubmit={submit} style={{ maxWidth: 460 }}>
            <div className="field">
              <div className="label"><Mail size={13} /> Email</div>
              <input className="inp" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@swiftlabs.dev" autoFocus />
            </div>
            <div className="field">
              <div className="label"><KeyRound size={13} /> Password</div>
              <input className="inp" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Your password" />
            </div>
            {error && <div className="errbox" style={{ marginBottom: 14 }}><AlertTriangle size={18} />{error}</div>}
            <button className="go" type="submit" disabled={loading || !password}>
              {loading ? <><Loader2 className="spin" size={18} /> Signing in...</> : <>Sign in</>}
            </button>
          </form>

          <footer className="foot">&copy; {new Date().getFullYear()} Swift Labs · Karachi.</footer>
        </div>
      </div>
    </>
  );
}
