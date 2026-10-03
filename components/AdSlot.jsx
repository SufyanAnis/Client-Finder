"use client";

// A manual AdSense unit. Renders nothing until both the publisher id and this
// placement's slot id are configured, so the site looks clean before approval.
// Kept away from interactive controls on purpose (AdSense accidental-click policy).

import { useEffect, useRef } from "react";
import { ADS } from "../lib/site";

export default function AdSlot({ slot, format = "auto", layout }) {
  const ref = useRef(null);
  const enabled = !!(ADS.client && slot);

  useEffect(() => {
    if (!enabled || !ref.current || ref.current.dataset.adsbygoogleStatus) return;
    try { (window.adsbygoogle = window.adsbygoogle || []).push({}); } catch {}
  }, [enabled]);

  if (!enabled) return null;
  return (
    <aside className="ad" aria-label="Advertisement">
      <span className="ad-label">Advertisement</span>
      <ins
        ref={ref}
        className="adsbygoogle"
        style={{ display: "block", textAlign: layout === "in-article" ? "center" : undefined }}
        data-ad-client={ADS.client}
        data-ad-slot={slot}
        data-ad-format={layout === "in-article" ? "fluid" : format}
        {...(layout ? { "data-ad-layout": layout } : {})}
        data-full-width-responsive="true"
      />
    </aside>
  );
}
