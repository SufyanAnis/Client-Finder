"use client";

import React, { useState } from "react";
import { Send, Loader2, CheckCircle2, AlertTriangle, Sparkles } from "lucide-react";

const SERVICES = [
  "Web build (Next.js / React)", "Mobile app", "AI integration & agents",
  "Enterprise (SAP / Apigee / Jira)", "SEO & growth marketing", "Design system / UI-UX", "Game UI/UX", "Not sure yet",
];

export default function RequestPage() {
  const [form, setForm] = useState({ name: "", company: "", email: "", phone: "", service: SERVICES[0], message: "", botcheck: "" });
  const [state, setState] = useState("idle"); // idle | sending | done | error
  const [error, setError] = useState("");

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  async function submit(e) {
    e.preventDefault();
    setState("sending"); setError("");
    try {
      const res = await fetch("/api/request", {
        method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error || "Something went wrong");
      setState("done");
    } catch (err) {
      setError(err.message || "Couldn't send — please try again."); setState("error");
    }
  }

  return (
    <>
      <div className="bg" />
      <div className="shell">
        <nav className="nav">
          <div className="nav-in">
            <div className="brand">
              <div className="logo">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19.07 4.93A10 10 0 0 0 6.99 3.34"/><path d="M4 6h.01"/><path d="M2.29 9.62A10 10 0 1 0 21.31 8.35"/><path d="M16.24 7.76A6 6 0 1 0 8.23 16.67"/><path d="M12 18h.01"/><path d="M17.99 11.66A6 6 0 0 1 15.77 16.67"/><circle cx="12" cy="12" r="2"/><path d="m13.41 10.59 5.66-5.66"/></svg>
              </div>
              <div>
                <b style={{ display: "block", lineHeight: 1 }}>Swift Labs</b>
                <span className="tag">Work with us</span>
              </div>
            </div>
            <a className="site" href="https://website-portfolio-kdli.vercel.app/" target="_blank" rel="noreferrer">
              Main site
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 7h10v10"/><path d="M7 17 17 7"/></svg>
            </a>
          </div>
        </nav>

        <div className="wrap">
          <header className="hero">
            <div className="pill"><span className="dot" /> Tell us what you need</div>
            <h1>Let&apos;s build your <em>next product.</em></h1>
            <p>Share a few details and the Swift Labs team (Sufyan, Waqar, Zaviar) will get back to you — usually within 12 hours on weekdays. Discovery sprints start at $1,500.</p>
          </header>

          {state === "done" ? (
            <div className="panel" style={{ textAlign: "center", padding: "44px 24px" }}>
              <CheckCircle2 size={40} style={{ color: "var(--green)", marginBottom: 14 }} />
              <h2 style={{ fontFamily: "'Bricolage Grotesque'", fontWeight: 700, fontSize: 22, marginBottom: 8 }}>Thanks — we&apos;ve got your request.</h2>
              <p style={{ color: "var(--muted)", maxWidth: 420, margin: "0 auto 20px", lineHeight: 1.55 }}>
                We&apos;ll review it and reach out to <b style={{ color: "var(--text)" }}>{form.email}</b> shortly.
              </p>
              <button className="btn" onClick={() => { setForm({ name: "", company: "", email: "", phone: "", service: SERVICES[0], message: "", botcheck: "" }); setState("idle"); }}>
                <Sparkles size={15} /> Send another request
              </button>
            </div>
          ) : (
            <form className="panel" onSubmit={submit}>
              <div className="row">
                <div className="field">
                  <div className="label">Your name *</div>
                  <input className="inp" required value={form.name} onChange={set("name")} placeholder="Jane Doe" />
                </div>
                <div className="field">
                  <div className="label">Company</div>
                  <input className="inp" value={form.company} onChange={set("company")} placeholder="Acme Inc." />
                </div>
              </div>

              <div className="row">
                <div className="field">
                  <div className="label">Email *</div>
                  <input className="inp" type="email" required value={form.email} onChange={set("email")} placeholder="jane@acme.com" />
                </div>
                <div className="field">
                  <div className="label">Phone / WhatsApp</div>
                  <input className="inp" value={form.phone} onChange={set("phone")} placeholder="+44 7700 900000" />
                </div>
              </div>

              <div className="field">
                <div className="label">Service you want</div>
                <select className="inp" value={form.service} onChange={set("service")}>
                  {SERVICES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              <div className="field">
                <div className="label">What do you need?</div>
                <textarea className="inp" rows={4} value={form.message} onChange={set("message")} placeholder="A few sentences about your project, timeline, and budget if you have one." style={{ resize: "vertical", minHeight: 96 }} />
              </div>

              {/* honeypot — hidden from humans */}
              <input type="text" name="botcheck" value={form.botcheck} onChange={set("botcheck")} tabIndex={-1} autoComplete="off" style={{ position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0 }} aria-hidden="true" />

              {state === "error" && (
                <div className="errbox" style={{ marginBottom: 14 }}><AlertTriangle size={18} />{error}</div>
              )}

              <button className="go" type="submit" disabled={state === "sending"}>
                {state === "sending" ? <><Loader2 className="spin" size={18} /> Sending...</> : <><Send size={17} /> Send request</>}
              </button>
            </form>
          )}

          <footer className="foot">
            Your details go straight to the Swift Labs team. &copy; {new Date().getFullYear()} Swift Labs · Karachi.
          </footer>
        </div>
      </div>
    </>
  );
}
