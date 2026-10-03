"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

export default function CopyButton({ text, small, label = "copy" }) {
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
    <button type="button" className={"linkbtn" + (done ? " done" : "")} onClick={go}>
      {done ? <Check size={small ? 12 : 13} /> : <Copy size={small ? 12 : 13} />} {done ? "copied" : label}
    </button>
  );
}
