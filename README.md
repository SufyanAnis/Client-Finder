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
- **AI keys** — the server auto-detects the provider from whichever key is set:
  - **Free (recommended):** **Groq** (LLM) + **Tavily** (web search). Get a free Groq key at https://console.groq.com and a free Tavily key at https://tavily.com. Set `GROQ_API_KEY` and `TAVILY_API_KEY`. Groq has no built-in web search, so Tavily supplies the live results the model turns into real leads. Both free tiers work worldwide (including Pakistan).
  - **Paid:** **Anthropic** from https://console.anthropic.com → *Settings → API Keys*. Set `ANTHROPIC_API_KEY` — it searches the web natively, so no Tavily needed.
  - **Gemini:** a free key from https://aistudio.google.com works as `GEMINI_API_KEY`, **but Google's free tier is region-locked and unavailable in some countries (incl. Pakistan)**, where it returns `limit: 0`.

  Precedence if several are set: Anthropic → Gemini → Groq. Keep lead counts modest while testing.

---

## 2. Run locally

```bash
npm install
cp .env.example .env.local      # then paste your real key into .env.local
npm run dev                     # open http://localhost:3000
```

`.env.local`:
```
# Free path — Groq (LLM) + Tavily (web search):
GROQ_API_KEY=your-groq-key
TAVILY_API_KEY=your-tavily-key
# Paid alternative (no Tavily needed):
# ANTHROPIC_API_KEY=sk-ant-your-real-key
# optional: GROQ_MODEL=llama-3.3-70b-versatile  /  ANTHROPIC_MODEL=claude-sonnet-4-6
```

---

## 3. Deploy to Vercel

**Option A — GitHub (recommended)**
1. Push this folder to a new GitHub repo.
2. Go to https://vercel.com → **Add New → Project** → import the repo.
3. Before deploying, open **Environment Variables** and add either:
   - `GROQ_API_KEY` **and** `TAVILY_API_KEY` (free path), **or**
   - `ANTHROPIC_API_KEY` (paid; no Tavily needed)
   - (optional) `GROQ_MODEL` / `ANTHROPIC_MODEL`
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
- **Provider & model** — Groq defaults to `llama-3.3-70b-versatile` (override with `GROQ_MODEL`); Anthropic defaults to `claude-sonnet-4-6` (override with `ANTHROPIC_MODEL`); Gemini defaults to `gemini-2.0-flash` (`GEMINI_MODEL`). Verify current model names at https://console.groq.com/docs/models or https://docs.claude.com.
- **Free-tier limits** — Groq and Tavily free tiers are rate-limited (fine for normal lead-finding; don't hammer them). Tavily's free plan covers ~1,000 searches/month — one per "Find leads" run.
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
│   ├── llm.js                    # provider helper (Groq free / Anthropic paid / Gemini)
│   └── search.js                 # Tavily web search (feeds Groq real companies)
├── .env.example
├── next.config.mjs
└── package.json
```

© Swift Labs · Karachi.
