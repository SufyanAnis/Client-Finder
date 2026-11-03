"use client";

import { useMemo, useState } from "react";
import { ExternalLink, FileSpreadsheet, Copy, Check, Share2, MessageCircle, Linkedin, Send } from "lucide-react";

const csvCell = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;
function downloadCsv(name, rows) {
  const head = Object.keys(rows[0] || { empty: "" });
  const csv = [head.map(csvCell).join(","), ...rows.map((r) => head.map((h) => csvCell(r[h])).join(","))].join("\r\n");
  const url = URL.createObjectURL(new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8" }));
  const a = document.createElement("a");
  a.href = url; a.download = name; a.click();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

function useCopy() {
  const [done, setDone] = useState("");
  const copy = async (key, text) => {
    try { await navigator.clipboard.writeText(text); } catch {}
    setDone(key); setTimeout(() => setDone(""), 1600);
  };
  return [done, copy];
}

const replyStarter = (title) =>
  `Hi! Saw your post "${title.replace(/^\[[^\]]+\]\s*/, "").slice(0, 90)}". I do exactly this kind of work — happy to share 2–3 relevant examples and a quick plan/estimate. What's your timeline?`;

const ago = (iso) => {
  const h = Math.round((Date.now() - Date.parse(iso)) / 3600000);
  return h < 1 ? "just now" : h < 24 ? `${h}h ago` : `${Math.round(h / 24)}d ago`;
};

export function ShareBar({ url, text }) {
  const [done, copy] = useCopy();
  const enc = encodeURIComponent;
  return (
    <div className="sharebar">
      <span className="label" style={{ margin: 0 }}><Share2 size={13} /> Share</span>
      <button type="button" className="btn" onClick={() => copy("link", url)}>{done === "link" ? <><Check size={14} /> Copied</> : <><Copy size={14} /> Copy link</>}</button>
      <a className="btn" href={`https://wa.me/?text=${enc(text + " " + url)}`} target="_blank" rel="noopener"><MessageCircle size={14} /> WhatsApp</a>
      <a className="btn" href={`https://www.linkedin.com/sharing/share-offsite/?url=${enc(url)}`} target="_blank" rel="noopener"><Linkedin size={14} /> LinkedIn</a>
      <a className="btn" href={`https://twitter.com/intent/tweet?text=${enc(text)}&url=${enc(url)}`} target="_blank" rel="noopener">X</a>
      <a className="btn" href={`https://t.me/share/url?url=${enc(url)}&text=${enc(text)}`} target="_blank" rel="noopener"><Send size={14} /> Telegram</a>
    </div>
  );
}

export function RedditBoard({ cats }) {
  const [cat, setCat] = useState("all");
  const [done, copy] = useCopy();
  const posts = useMemo(
    () => cats.flatMap((c) => c.posts.map((p) => ({ ...p, cat: c.name, catSlug: c.slug }))).filter((p) => cat === "all" || p.catSlug === cat),
    [cats, cat]
  );
  return (
    <>
      <div className="board-tools">
        <div className="chips">
          <button type="button" className={"chip" + (cat === "all" ? " on" : "")} onClick={() => setCat("all")}>All ({cats.reduce((n, c) => n + c.posts.length, 0)})</button>
          {cats.map((c) => (
            <button key={c.slug} type="button" className={"chip" + (cat === c.slug ? " on" : "")} onClick={() => setCat(c.slug)}>{c.name} ({c.posts.length})</button>
          ))}
        </div>
        <button type="button" className="btn export" disabled={!posts.length}
          onClick={() => downloadCsv(`reddit-leads-${new Date().toISOString().slice(0, 10)}.csv`, posts.map((p) => ({ Category: p.cat, Title: p.title, Subreddit: "r/" + p.subreddit, Budget: p.budget, Link: p.url })))}>
          <FileSpreadsheet size={15} /> Export CSV
        </button>
      </div>
      {posts.length === 0 ? <div className="pipe-empty">No posts in this category right now — check back after the next refresh.</div> : (
        <div className="leadlist">
          {posts.map((p) => (
            <div key={p.id} className="leadrow">
              <div className="leadrow-main">
                <a className="leadrow-t" href={p.url} target="_blank" rel="noopener nofollow">{p.title}</a>
                <div className="leadrow-meta">
                  <span>r/{p.subreddit}</span>
                  <span>{p.cat}</span>
                  {p.budget && <span className="budget">{p.budget}</span>}
                </div>
              </div>
              <div className="leadrow-act">
                <button type="button" className="linkbtn" onClick={() => copy(p.id, replyStarter(p.title))}>
                  {done === p.id ? <><Check size={13} /> copied</> : <><Copy size={13} /> reply starter</>}
                </button>
                <a className="linkbtn" href={p.url} target="_blank" rel="noopener nofollow"><ExternalLink size={13} /> open</a>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

export function DiscordBoard({ posts }) {
  const [done, copy] = useCopy();
  return (
    <>
      <div className="board-tools">
        <span className="count">{posts.length} RECENT HIRING MESSAGES</span>
        <button type="button" className="btn export" disabled={!posts.length}
          onClick={() => downloadCsv(`discord-leads-${new Date().toISOString().slice(0, 10)}.csv`, posts.map((p) => ({ Channel: p.channel, Posted: p.posted.slice(0, 16).replace("T", " "), Budget: p.budget, Message: p.text, Link: p.url })))}>
          <FileSpreadsheet size={15} /> Export CSV
        </button>
      </div>
      {posts.length === 0 ? <div className="pipe-empty">No hiring messages in the connected channels in the last two weeks.</div> : (
        <div className="leadlist">
          {posts.map((p) => (
            <div key={p.id} className="leadrow">
              <div className="leadrow-main">
                <div className="leadrow-text">{p.text}</div>
                <div className="leadrow-meta">
                  <span>{p.channel}</span>
                  <span>{ago(p.posted)}</span>
                  {p.budget && <span className="budget">{p.budget}</span>}
                </div>
              </div>
              <div className="leadrow-act">
                <button type="button" className="linkbtn" onClick={() => copy(p.id, replyStarter(p.text.split("\n")[0]))}>
                  {done === p.id ? <><Check size={13} /> copied</> : <><Copy size={13} /> reply starter</>}
                </button>
                <a className="linkbtn" href={p.url} target="_blank" rel="noopener nofollow"><ExternalLink size={13} /> open in Discord</a>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

// Structured job feeds (Hacker News, Remote OK, We Work Remotely).
// Links are followed (no "nofollow") — Remote OK's API terms require it.
export function FeedBoard({ items, name }) {
  const [cat, setCat] = useState("all");
  const cats = useMemo(() => {
    const m = {};
    items.forEach((x) => (m[x.category] = (m[x.category] || 0) + 1));
    return Object.entries(m).sort((a, b) => b[1] - a[1]);
  }, [items]);
  const shown = items.filter((x) => cat === "all" || x.category === cat);
  return (
    <>
      <div className="board-tools">
        <div className="chips">
          <button type="button" className={"chip" + (cat === "all" ? " on" : "")} onClick={() => setCat("all")}>All ({items.length})</button>
          {cats.map(([c, n]) => (
            <button key={c} type="button" className={"chip" + (cat === c ? " on" : "")} onClick={() => setCat(c)}>{c} ({n})</button>
          ))}
        </div>
        <button type="button" className="btn export" disabled={!shown.length}
          onClick={() => downloadCsv(`${name}-leads-${new Date().toISOString().slice(0, 10)}.csv`, shown.map((x) => ({ Source: x.source, Company: x.company, Role: x.title, Category: x.category, Location: x.location, Salary: x.salary, Posted: x.posted.slice(0, 10), Link: x.url })))}>
          <FileSpreadsheet size={15} /> Export CSV
        </button>
      </div>
      {shown.length === 0 ? <div className="pipe-empty">Nothing here right now — check back after the next refresh.</div> : (
        <div className="leadlist">
          {shown.map((x) => (
            <div key={x.id} className="leadrow">
              <div className="leadrow-main">
                <a className="leadrow-t" href={x.url} target="_blank" rel="noopener">{x.company ? <><span className="co-name">{x.company}</span> — </> : null}{x.title}</a>
                {x.detail && <div className="leadrow-text" style={{ marginTop: 4, color: "var(--muted)", fontSize: 13 }}>{x.detail}</div>}
                <div className="leadrow-meta">
                  <span>via {x.source}</span>
                  {x.jobType && <span className="budget">{x.jobType}</span>}
                  <span>{x.category}</span>
                  {x.location && <span>{x.location}</span>}
                  {x.posted && <span>{ago(x.posted)}</span>}
                  {x.salary && <span className="budget">{x.salary}</span>}
                </div>
              </div>
              <div className="leadrow-act">
                <a className="linkbtn" href={x.url} target="_blank" rel="noopener"><ExternalLink size={13} /> open</a>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
