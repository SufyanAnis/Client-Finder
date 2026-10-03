"use client";

import { useState } from "react";
import { Loader2, AlertTriangle, Check, Send } from "lucide-react";

const TOPICS = ["Feedback", "Bug report", "Correction to a guide", "Remove a company from results", "Partnership / advertising", "Other"];

export default function ContactForm() {
  const [f, setF] = useState({ name: "", email: "", service: TOPICS[0], message: "", botcheck: "" });
  const [state, setState] = useState({ loading: false, error: "", done: false });
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  async function submit(e) {
    e.preventDefault();
    setState({ loading: true, error: "", done: false });
    try {
      const res = await fetch("/api/contact", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(f) });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || data.error) throw new Error(data.error || "Couldn't send your message.");
      setState({ loading: false, error: "", done: true });
    } catch (err) {
      setState({ loading: false, error: err.message, done: false });
    }
  }

  if (state.done) {
    return <div className="panel okbox"><Check size={18} /> Thanks — your message is on its way. We'll reply to {f.email}.</div>;
  }

  return (
    <form className="panel" onSubmit={submit}>
      <div className="row">
        <div className="field">
          <label className="label" htmlFor="c-name">Name</label>
          <input id="c-name" className="inp" required maxLength={120} value={f.name} onChange={set("name")} />
        </div>
        <div className="field">
          <label className="label" htmlFor="c-email">Email</label>
          <input id="c-email" className="inp" type="email" required maxLength={160} value={f.email} onChange={set("email")} />
        </div>
      </div>
      <div className="field">
        <label className="label" htmlFor="c-topic">Topic</label>
        <select id="c-topic" className="inp" value={f.service} onChange={set("service")}>
          {TOPICS.map((t) => <option key={t}>{t}</option>)}
        </select>
      </div>
      <div className="field">
        <label className="label" htmlFor="c-msg">Message</label>
        <textarea id="c-msg" className="inp" rows={6} required maxLength={2000} value={f.message} onChange={set("message")} />
      </div>
      {/* honeypot: hidden from people, filled by bots */}
      <input type="text" name="botcheck" value={f.botcheck} onChange={set("botcheck")} tabIndex={-1} autoComplete="off" className="hp" aria-hidden="true" />
      {state.error && <div className="errbox" style={{ marginBottom: 14 }}><AlertTriangle size={18} />{state.error}</div>}
      <button className="go" type="submit" disabled={state.loading}>
        {state.loading ? <><Loader2 className="spin" size={18} /> Sending...</> : <><Send size={17} /> Send message</>}
      </button>
    </form>
  );
}
