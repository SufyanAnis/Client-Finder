"use client";

import { useMemo, useState } from "react";

const SPAMMY = [
  "free", "guarantee", "guaranteed", "risk-free", "act now", "limited time", "click here", "buy now", "winner", "urgent",
  "100%", "no obligation", "earn money", "cash", "best price", "lowest price", "once in a lifetime", "special promotion",
  "double your", "increase sales", "amazing", "incredible deal", "exclusive deal", "dear sir", "dear madam", "to whom it may concern",
];
const CLICHES = ["i hope this email finds you well", "i hope this finds you well", "just checking in", "touching base", "circle back", "i wanted to reach out", "quick question", "synergy", "game-changer", "leverage"];

const SAMPLE = `Subject: your booking page on mobile

Hi Maya,

I tried booking a cleaning at Northgate Dental on my phone this morning and the form wouldn't submit after the date step. On desktop it works fine, so it looks like a mobile-only bug.

I fix this kind of thing for clinics. Happy to send a 2-minute screen recording of what I saw, free, so your team can fix it either way.

Want me to send it over?

Sam`;

function syllables(word) {
  const w = word.toLowerCase().replace(/[^a-z]/g, "");
  if (w.length <= 3) return 1;
  const m = w.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, "").replace(/^y/, "").match(/[aeiouy]{1,2}/g);
  return Math.max(m ? m.length : 1, 1);
}

function analyse(raw) {
  const text = raw.replace(/\r/g, "");
  const lines = text.split("\n");
  let subject = "";
  let body = text;
  if (/^subject\s*:/i.test(lines[0] || "")) { subject = lines[0].replace(/^subject\s*:\s*/i, "").trim(); body = lines.slice(1).join("\n"); }
  const lower = body.toLowerCase();
  const words = body.match(/[A-Za-z0-9'’$%-]+/g) || [];
  const sentences = body.split(/[.!?]+(?:\s|$)/).map((s) => s.trim()).filter((s) => s.split(/\s+/).length > 2);
  const avgSentence = sentences.length ? words.length / sentences.length : 0;
  const syl = words.reduce((a, w) => a + syllables(w), 0);
  const grade = words.length && sentences.length ? 0.39 * (words.length / sentences.length) + 11.8 * (syl / words.length) - 15.59 : 0;
  const links = (body.match(/https?:\/\/|www\./gi) || []).length;
  const exclaims = (body.match(/!/g) || []).length;
  const questions = (body.match(/\?/g) || []).length;
  const caps = (body.match(/\b[A-Z]{4,}\b/g) || []).filter((w) => !["SEO", "HTML", "HTTPS", "CEO", "CTO", "SaaS"].includes(w));
  const spam = SPAMMY.filter((s) => new RegExp(`(^|[^a-z])${s.replace(/[$%]/g, "\\$&")}([^a-z]|$)`, "i").test(lower));
  const cliches = CLICHES.filter((c) => lower.includes(c));
  const placeholders = (text.match(/\{[^}]+\}|\[[^\]]+\]/g) || []);
  const youCount = (lower.match(/\byou(r|rs)?\b/g) || []).length;
  const meCount = (lower.match(/\b(i|i'm|i've|me|my|we|our|us)\b/g) || []).length;

  const checks = [];
  const add = (status, title, detail) => checks.push({ status, title, detail });
  const wc = words.length;
  if (wc === 0) return null;
  add(wc <= 125 && wc >= 40 ? "pass" : wc < 40 ? "warn" : wc <= 175 ? "warn" : "fail", `Length: ${wc} words`,
    wc > 125 ? "Cold emails read best around 50–125 words. Cut background and keep one idea." : wc < 40 ? "Very short — make sure there's a specific reason you're writing and a clear ask." : "A good length for a first email.");
  if (subject) {
    const sw = subject.split(/\s+/).filter(Boolean).length;
    add(sw <= 7 && !/[!]/.test(subject) ? "pass" : "warn", `Subject: ${sw} words`, sw > 7 ? "Shorter subjects (2–6 words) look like a real person wrote them." : /!/.test(subject) ? "Drop the exclamation mark from the subject." : "Short and plain — good.");
  } else add("warn", "No subject line found", "Start with a line like 'Subject: …' to check it too.");
  add(links === 0 ? "pass" : links === 1 ? "warn" : "fail", `Links: ${links}`, links === 0 ? "No links — best for a first email's deliverability." : "Links in a first cold email can hurt deliverability. Offer to send it if they reply.");
  add(spam.length === 0 ? "pass" : "fail", spam.length ? `Spam-trigger phrases: ${spam.join(", ")}` : "No spam-trigger phrases", spam.length ? "Rephrase these — they look like marketing and can trip filters." : "Nothing that reads like a promotion.");
  add(cliches.length === 0 ? "pass" : "warn", cliches.length ? `Clichés: ${cliches.join(", ")}` : "No stock phrases", cliches.length ? "These read as mass-sent. Open with something specific about them instead." : "Reads like a person, not a template.");
  add(exclaims <= 1 ? "pass" : "warn", `Exclamation marks: ${exclaims}`, exclaims > 1 ? "Keep it calm — one at most." : "Calm tone.");
  add(caps.length === 0 ? "pass" : "warn", caps.length ? `ALL-CAPS words: ${caps.slice(0, 5).join(", ")}` : "No shouting", caps.length ? "Caps read as shouting and look spammy." : "No all-caps words.");
  add(questions >= 1 ? "pass" : "fail", questions ? "Has a question / clear ask" : "No question or clear ask", questions ? "Make sure it's one easy, low-commitment ask." : "End with one easy question so replying takes ten seconds.");
  add(placeholders.length === 0 ? "pass" : "fail", placeholders.length ? `Unfilled placeholders: ${placeholders.slice(0, 4).join(", ")}` : "No leftover placeholders", placeholders.length ? "Replace these before sending — nothing kills a reply faster." : "All placeholders filled.");
  add(youCount >= meCount ? "pass" : "warn", `“You” vs “I/we”: ${youCount} vs ${meCount}`, youCount >= meCount ? "Focused on them — good." : "It's mostly about you. Rewrite a sentence or two around their situation.");
  add(avgSentence <= 20 ? "pass" : "warn", `Average sentence: ${avgSentence.toFixed(0)} words`, avgSentence > 20 ? "Break up long sentences — people skim on phones." : "Easy to skim.");
  add(grade <= 9 ? "pass" : "warn", `Reading level: grade ${Math.max(grade, 1).toFixed(0)}`, grade > 9 ? "Simpler words and shorter sentences will read faster." : "Plain and easy to read.");

  // a failed check actively costs points, so a spammy email can't coast on easy passes
  const pts = { pass: 1, warn: 0.5, fail: -0.5 };
  const score = Math.max(0, Math.round((checks.reduce((a, c) => a + pts[c.status], 0) / checks.length) * 100));
  return { score, checks };
}

export default function EmailChecker() {
  const [text, setText] = useState("");
  const res = useMemo(() => analyse(text), [text]);
  const color = !res ? "var(--muted)" : res.score >= 80 ? "var(--green)" : res.score >= 60 ? "var(--gold)" : "var(--red)";
  return (
    <div className="panel">
      <div className="label">Paste your cold email (first line can be “Subject: …”)</div>
      <textarea className="inp" rows={12} value={text} onChange={(e) => setText(e.target.value)} placeholder={"Subject: …\n\nHi {first name},\n\n…"} />
      <div style={{ display: "flex", gap: 10, marginTop: 10, flexWrap: "wrap" }}>
        <button type="button" className="btn" onClick={() => setText(SAMPLE)}>Try an example</button>
        {text && <button type="button" className="btn" onClick={() => setText("")}>Clear</button>}
        <span className="fine" style={{ marginLeft: "auto", alignSelf: "center" }}>Checked in your browser — nothing is uploaded.</span>
      </div>
      {res && (
        <div className="chk" aria-live="polite">
          <div className="chk-score"><span style={{ color }}>{res.score}</span><small>/100</small></div>
          <ul className="chk-list">
            {res.checks.map((c, i) => (
              <li key={i} className={"chk-" + c.status}>
                <span className="chk-dot" aria-hidden="true" />
                <div><b>{c.title}</b><p>{c.detail}</p></div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
