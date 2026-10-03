"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Loader2, Check, AlertTriangle } from "lucide-react";
import CopyButton from "./CopyButton";
import { saveKey } from "./Paywall";

// Polls the order until Safepay's confirmation lands, then shows and stores the key.
export default function OrderStatus({ order, error }) {
  const [s, setS] = useState({ status: order ? "checking" : "error", key: "", credits: 0 });

  useEffect(() => {
    if (!order) return;
    let stop = false, tries = 0;
    async function poll() {
      try {
        const res = await fetch(`/api/order?id=${encodeURIComponent(order)}`, { cache: "no-store" });
        const d = await res.json();
        if (d.status === "paid" && d.key) {
          saveKey(d.key);
          setS({ status: "paid", key: d.key, credits: d.balance ?? d.credits });
          return;
        }
        if (res.status === 404) { setS({ status: "error" }); return; }
      } catch {}
      tries++;
      if (!stop && tries < 40) setTimeout(poll, 3000);
      else if (!stop) setS((x) => ({ ...x, status: "slow" }));
    }
    poll();
    return () => { stop = true; };
  }, [order]);

  if (s.status === "paid") {
    return (
      <div className="article">
        <div className="art-head">
          <div className="kicker" style={{ color: "var(--green)" }}><Check size={13} /> Payment received</div>
          <h1>You're all set.</h1>
          <p className="lede">{s.credits} search credits are on your license key, and it's saved in this browser.</p>
        </div>
        <div className="keybox">
          <div className="label">Your license key — keep it safe</div>
          <div className="keybox-k">{s.key}</div>
          <CopyButton text={s.key} label="copy key" />
        </div>
        <p className="fine">Paste this key under "Have a key?" on another device or browser to use the same credits. Lost it? <Link href="/contact">Contact us</Link> with your payment details.</p>
        <Link className="go" href="/#finder" style={{ marginTop: 20, textDecoration: "none" }}>Start searching →</Link>
      </div>
    );
  }

  if (s.status === "error" || error) {
    return (
      <div className="article">
        <div className="art-head"><h1>We couldn't find that order.</h1></div>
        <div className="errbox"><AlertTriangle size={18} />If you were charged, <Link href="/contact">contact us</Link> with the payment receipt from Safepay and we'll sort it out quickly.</div>
      </div>
    );
  }

  return (
    <div className="article">
      <div className="art-head">
        <h1>Confirming your payment…</h1>
        <p className="lede">{s.status === "slow"
          ? "This is taking longer than usual. Keep this page open — or contact us with your Safepay receipt if it doesn't complete."
          : "This usually takes a few seconds. Don't close this page."}</p>
      </div>
      <div className="status"><Loader2 className="spin" size={18} /> Waiting for Safepay's confirmation</div>
    </div>
  );
}
