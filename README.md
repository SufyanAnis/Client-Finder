# Swift Labs — Lead Finder

A deployable Next.js app that finds real prospective clients with live web research,
scores fit, drafts personalized outreach, saves everything to a pipeline, and exports
to Excel. Built to match the Swift Labs aesthetic (dark, engineered).

---

## What it does

- **Find leads** — set geography, niche, company size, the service to lead with, and a channel. The server runs a live web-search prospecting call (via Claude) and returns real companies with a fit score, a "why now" signal, the role to target, and any public contact it can find.
- **Draft outreach** — one click writes a personalized Email / LinkedIn / WhatsApp message that references the specific signal.
- **Pipeline** — save leads to a table. Email / phone / LinkedIn / needs cells are **editable** so you can fill in whatever the research missed.
- **Export to Excel** — download the whole pipeline as an `.xlsx` any time, with every field (company, website, location, role, email, phone, LinkedIn, needs, fit, signal, channel, message, date).

---

## 1. Prerequisites

- **Node.js 18+**
- **One AI key** — the server auto-detects which provider to use:
  - **Free:** a **Google Gemini** key from https://aistudio.google.com (no credit card for the free tier). Set it as `GEMINI_API_KEY`. Uses Google Search grounding so leads are real, not invented.
  - **Paid:** an **Anthropic** key from https://console.anthropic.com → *Settings → API Keys*. Set it as `ANTHROPIC_API_KEY`. (Web search and model calls bill to this key.)

  If both are set, Anthropic wins. Keep lead counts modest while testing.

---

## 2. Run locally

```bash
npm install
cp .env.example .env.local      # then paste your real key into .env.local
npm run dev                     # open http://localhost:3000
```

`.env.local` — set ONE of these:
```
# Free:
GEMINI_API_KEY=your-aistudio-key
# Paid alternative:
# ANTHROPIC_API_KEY=sk-ant-your-real-key
# optional: GEMINI_MODEL=gemini-2.0-flash  /  ANTHROPIC_MODEL=claude-sonnet-4-6
```

---

## 3. Deploy to Vercel

**Option A — GitHub (recommended)**
1. Push this folder to a new GitHub repo.
2. Go to https://vercel.com → **Add New → Project** → import the repo.
3. Before deploying, open **Environment Variables** and add ONE of:
   - `GEMINI_API_KEY` = your free Google AI Studio key, **or**
   - `ANTHROPIC_API_KEY` = your paid Anthropic key
   - (optional) `GEMINI_MODEL` / `ANTHROPIC_MODEL`
4. Click **Deploy**. Done — you get a `*.vercel.app` URL. Add a custom domain in Project → Settings → Domains if you want.

**Option B — Vercel CLI**
```bash
npm i -g vercel
vercel                 # first deploy (preview)
vercel env add ANTHROPIC_API_KEY    # paste key, choose Production + Preview
vercel --prod          # promote to production
```

> The API key lives only on the server (in the `/api` routes). It is never shipped to the browser. Never commit `.env.local`.

---

## 4. Storage & how the Excel sheet works

By default, saved leads are stored in **your browser** (localStorage) and the **Export to Excel** button downloads the full sheet on demand. This needs **zero extra services** — it deploys with just the one API key.

Trade-off: localStorage is per-browser/device, so the pipeline isn't shared across machines or teammates. For shared, always-on storage where leads append to a real spreadsheet automatically, upgrade to one of:

- **Google Sheets backend** — every saved lead appends a row to a Google Sheet you own; open/download it as Excel any time. (Best literal match for "save to a sheet.")
- **Database** — Vercel Postgres / Supabase / Turso, with the Excel export reading from it.

Both are straightforward add-ons to this codebase — ask and they can be wired in.

---

## 5. Notes

- **Function timeout** — web search + generation can take 20–40s. Vercel Hobby allows up to 60s (`maxDuration = 60` is set). If you hit timeouts, lower the lead count or upgrade the plan.
- **Provider & model** — with `GEMINI_API_KEY` set, defaults to `gemini-2.0-flash` (override with `GEMINI_MODEL`). With `ANTHROPIC_API_KEY` set, defaults to `claude-sonnet-4-6` (override with `ANTHROPIC_MODEL`). Gemini is free; Anthropic is paid. Verify current model names at https://aistudio.google.com or https://docs.claude.com.
- **Contact data** — emails/phones/LinkedIn from web search are best-effort and often blank. The pipeline cells are editable for exactly this reason; for verified contacts at scale, use a dedicated data provider.
- **Sending** — this tool finds and drafts only. You review and send. Keep volume sane and personal to stay off spam filters and within anti-spam law (CAN-SPAM / GDPR / PECR).

---

## Project structure

```
swiftlabs-lead-finder/
├── app/
│   ├── api/find-leads/route.js   # web-search prospecting (server, holds key)
│   ├── api/draft/route.js        # outreach drafting (server)
│   ├── globals.css               # dark "engineered" theme
│   ├── layout.jsx
│   └── page.jsx                  # nav + hero + footer shell
├── components/
│   └── LeadApp.jsx               # finder + pipeline + Excel export (client)
├── lib/
│   └── llm.js                    # provider helper (Gemini free / Anthropic paid)
├── .env.example
├── next.config.mjs
└── package.json
```

© Swift Labs · Karachi.
