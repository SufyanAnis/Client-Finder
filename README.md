# FindMyClients

A free AI lead finder for freelancers and small agencies, plus a library of guides, profession pages and
outreach templates that carry the SEO and the ads. Next.js 14 (App Router), deployed on Vercel.

- **Lead finder** (`/`) — describe what you sell and where; the server searches the live web for demand
  signals (companies' own job posts, recent funding/launch news, new openings), an LLM picks out the real
  companies, scores fit and writes the "why now". Drafts outreach (Email / LinkedIn / WhatsApp) in the
  user's voice, on-demand public contact lookup, pipeline in localStorage, Excel export.
- **Content** — 12 guides (`/guides`), 12 profession pages (`/find-clients`), 15 templates (`/templates`).
  Lives in `content/` as plain JS objects; format and quality rules in `content/CONTENT_SPEC.md`.
- **Trust pages** — `/about`, `/contact`, `/privacy`, `/terms`.
- **SEO** — per-page metadata + canonicals, `sitemap.xml`, `robots.txt`, JSON-LD (WebApplication, Article,
  FAQPage, BreadcrumbList), generated OG image, static generation for every content page.
- **Ads** — AdSense script, verification meta tag, `/ads.txt` and manual ad slots, all switched on by env vars.

## Paywall: one free search, then Safepay credit packs

- Every visitor gets `FREE_SEARCHES` (default 1) free search, ever. After that each search costs one credit.
- Credits are sold in packs (`lib/plans.js`: Rs 499 / 1,999 / 4,999 for 10 / 50 / 150) through **Safepay** hosted
  checkout. Paying issues a license key `FMC-XXXX-XXXX-XXXX-XXXX`, shown on `/pricing/success` and saved in the
  browser; it is sent as the `x-fmc-key` header. Balances live in Redis against a SHA-256 of the key.
- Fulfilment happens on the signed redirect (`/api/checkout/complete`, HMAC-SHA256 of the tracker with the v1
  secret) or the signed webhook (`/api/safepay/webhook`, HMAC-SHA512) — whichever arrives first, exactly once.
- Failed searches refund the credit (or the free search) automatically.
- **The paywall only switches on when Safepay keys AND Upstash Redis are set** (`paywallEnabled()` in
  `lib/credits.js`); until then the site keeps free daily limits. Changing env vars needs a redeploy.
- Safepay setup: create the merchant account, copy the API key + v1 secret into Vercel env, add a webhook endpoint
  `https://<site>/api/safepay/webhook` and copy its secret, test with `SAFEPAY_ENV=sandbox`, then switch to
  `production`. Check the amount shown on Safepay checkout matches the price; if it shows 1/100th, set
  `SAFEPAY_AMOUNT_MULTIPLIER=100`.

## Free-tier economics

Every public search costs real API credits, so the site meters use:

| | Default | Env var |
|---|---|---|
| Searches per visitor per day | 3 | `FREE_SEARCHES_PER_DAY` |
| Drafts per visitor per day | 10 | `FREE_DRAFTS_PER_DAY` |
| Contact lookups per visitor per day | 5 | `FREE_LOOKUPS_PER_DAY` |
| Tavily credits per day for visitor searches, whole site | 20 | `GLOBAL_WEB_SEARCHES_PER_DAY` |

A search uses 2 Tavily credits (3 when the fallback runs); a lookup uses 1. Tavily's free plan is ~1,000
credits/month. The /leads boards that use search (Reddit, LinkedIn, X) refresh every 2 days (~9 credits/day) and visitor searches are capped at 20 credits/day, so the total (~880/month) stays inside the free plan — nothing is ever billed. Identical searches
are cached for 12 hours and cost nothing. Visitors are identified by a salted hash of their IP.
Raise the caps once you pay for Tavily or ads cover it.

**Use Upstash Redis in production** (free; add it from Vercel → Storage / Marketplace → Upstash). Without it
the counters and cache live in each serverless instance's memory, so limits are only approximate.

The signed-in owner (`/login`) is unlimited, gets 8 leads per search and automatic contact enrichment, and can
read contact-form messages at `/inbox`.

## Run locally

```bash
npm install
cp .env.example .env.local   # add GROQ_API_KEY + TAVILY_API_KEY at minimum
npm run dev                  # http://localhost:3000
```

Note: keys stored on Vercel as "Sensitive" can't be pulled with `vercel env pull` — paste them into
`.env.local` yourself.

## Deploy

The Vercel project `swiftlabs-lead-finder` holds the API keys. `vercel` deploys a preview,
`vercel --prod` deploys production. After the first production deploy, add `findmyclients.vercel.app`
under Project → Settings → Domains (or your own domain later) and set `NEXT_PUBLIC_SITE_URL` to match.

## Launch checklist (AdSense + SEO)

1. **Domain.** AdSense won't approve a `*.vercel.app` address — buy a domain, add it in Vercel, set
   `NEXT_PUBLIC_SITE_URL`, redeploy.
2. **Search Console.** Add the domain property, verify (DNS, or `NEXT_PUBLIC_GSC_VERIFICATION`), submit
   `/sitemap.xml`.
3. **Contact form.** Set `WEB3FORMS_ACCESS_KEY` (AdSense reviewers check that contact works).
4. **AdSense.** Apply with the domain, set `NEXT_PUBLIC_ADSENSE_CLIENT`, redeploy (this also publishes
   `/ads.txt`). In AdSense → Privacy & messaging, publish the GDPR consent message for EEA/UK/CH visitors.
   After approval, turn on Auto ads or create units and set the `NEXT_PUBLIC_AD_SLOT_*` ids.
5. **Protect the budget.** Upstash Redis + Cloudflare Turnstile keys (both free).

## Structure

```
app/
  page.jsx                 home: finder + how it works + links + FAQ
  guides/ find-clients/ templates/   index + [slug] pages rendered from content/
  about/ contact/ privacy/ terms/
  api/find-leads           metered search (lib/search, lib/llm, lib/ratelimit)
  api/draft                metered outreach drafting
  api/lookup-contact       metered public-contact lookup (lib/enrich)
  api/contact              contact form -> Web3Forms email / Supabase
  api/requests, inbox/     owner-only contact inbox
  sitemap.js robots.js opengraph-image.jsx ads.txt/ manifest.js
components/                LeadApp (finder), SiteChrome, Content renderers, AdSlot
content/                   guides/, professions/, templates/, index.js, CONTENT_SPEC.md
lib/                       site (brand/ads config), services, ratelimit, guard, llm, search, enrich, auth
middleware.js              protects /inbox and /api/requests only
```
