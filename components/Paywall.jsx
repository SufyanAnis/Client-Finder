"use client";

import { useState } from "react";
import { Loader2, KeyRound, Check, ShieldCheck } from "lucide-react";
import { PACKS, perSearch, fmtPrice } from "../lib/plans";

export const KEY_STORE = "fmc_key";
export const readKey = () => { try { return localStorage.getItem(KEY_STORE) || ""; } catch { return ""; } };
export const saveKey = (k) => { try { k ? localStorage.setItem(KEY_STORE, k) : localStorage.removeItem(KEY_STORE); } catch {} };

// Credit packs + buy buttons (redirects to Safepay checkout).
export function Packs({ compact }) {
  const [busy, setBusy] = useState("");
  const [error, setError] = useState("");
  async function buy(id) {
    setBusy(id); setError("");
    try {
      const res = await fetch("/api/checkout", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ pack: id }) });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.url) throw new Error(data.error || "Couldn't start checkout.");
      window.location.href = data.url;
    } catch (e) {
      setError(e.message); setBusy("");
    }
  }
  return (
    <>
      <div className={"packs" + (compact ? " packs-compact" : "")}>
        {PACKS.map((p) => (
          <div key={p.id} className={"pack" + (p.popular ? " pack-pop" : "")}>
            {p.popular && <span className="pack-badge">Most popular</span>}
            <div className="pack-name">{p.name}</div>
            <div className="pack-price">{fmtPrice(p.price)}</div>
            <div className="pack-credits">{p.credits} searches · {fmtPrice(perSearch(p))} each</div>
            {!compact && <p className="pack-blurb">{p.blurb}</p>}
            <button type="button" className={p.popular ? "go pack-go" : "btn pack-go"} onClick={() => buy(p.id)} disabled={!!busy}>
              {busy === p.id ? <><Loader2 className="spin" size={16} /> Opening checkout…</> : `Buy ${p.name}`}
            </button>
          </div>
        ))}
      </div>
      {error && <div className="errbox" style={{ marginTop: 12 }}>{error}</div>}
      <p className="fine pack-fine"><ShieldCheck size={13} /> Secure checkout by Safepay — cards, Easypaisa and JazzCash where available. Credits never expire. You get a license key instantly.</p>
    </>
  );
}

// "Already have a key?" box.
export function KeyEntry({ onKey }) {
  const [val, setVal] = useState("");
  const [state, setState] = useState({ busy: false, error: "", ok: "" });
  async function check(e) {
    e.preventDefault();
    setState({ busy: true, error: "", ok: "" });
    try {
      const res = await fetch("/api/credits", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ key: val }) });
      const data = await res.json().catch(() => ({}));
      if (!data.valid) throw new Error(data.error || "Key not found.");
      const k = val.trim().toUpperCase();
      saveKey(k);
      setState({ busy: false, error: "", ok: `Key saved — ${data.balance} credit${data.balance === 1 ? "" : "s"} left.` });
      onKey?.(k, data.balance);
    } catch (err) {
      setState({ busy: false, error: err.message, ok: "" });
    }
  }
  return (
    <form className="keyentry" onSubmit={check}>
      <KeyRound size={15} />
      <input className="inp" value={val} onChange={(e) => setVal(e.target.value)} placeholder="Have a key? FMC-XXXX-XXXX-XXXX-XXXX" aria-label="License key" spellCheck={false} />
      <button className="btn" type="submit" disabled={state.busy || !val.trim()}>{state.busy ? <Loader2 className="spin" size={15} /> : "Use key"}</button>
      {state.error && <div className="keyentry-msg err">{state.error}</div>}
      {state.ok && <div className="keyentry-msg ok"><Check size={13} /> {state.ok}</div>}
    </form>
  );
}

// Shown in the finder when the free search is used up or a key runs dry.
export default function Paywall({ message, onKey }) {
  return (
    <div className="paywall" id="paywall">
      <div className="paywall-t">Keep finding clients</div>
      <p className="paywall-m">{message || "You've used your free search."} Pick a credit pack — one credit is one search with up to 5 researched leads, drafts and contact lookups included.</p>
      <Packs compact />
      <KeyEntry onKey={onKey} />
    </div>
  );
}
