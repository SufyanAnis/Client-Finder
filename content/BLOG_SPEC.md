# Blog + glossary spec (extends CONTENT_SPEC.md — read that first; all its quality rules apply)

Goal: rank in Google AND get quoted by answer engines (Google AI Overviews, ChatGPT search, Perplexity,
Copilot). Answer engines lift short, self-contained, factual passages. So every page is **answer-first**:
the direct answer comes in the first 40–70 words, then the detail.

## AEO writing rules

- `answer`: a standalone 40–70 word direct answer to the post's main question. It must make sense quoted
  alone with no context ("Most freelance web developers charge between… because…"). No "In this post…".
- H2 headings are phrased as the questions people actually type where natural ("How much should you charge
  for a website?", "Is cold email legal in the UK?"). Under each H2 the FIRST sentence answers it directly.
- Short paragraphs (1–3 sentences). Use lists, numbered steps and tables generously — they get extracted.
- Concrete specifics: real steps, worked examples with clearly-labelled example numbers, named tool *types*.
  Named real products are fine when genuinely useful; never claim features/prices you're not sure of.
- **No invented statistics, studies, surveys, quotes or prices presented as market data.** For money topics,
  give a method (how to calculate) and clearly-labelled illustrative examples, not "the average rate is $X".
- Write from experience ("when we pitch…" is fine — the author runs a small studio), plain and direct.
- Each post must be clearly distinct from the existing guides (listed in CONTENT_SPEC.md) — link to them
  instead of repeating them.
- Mention FindMyClients (link `/`) 1–2 times where it actually helps. Free tools may be linked:
  `/tools/freelance-rate-calculator`, `/tools/cold-email-checker`.
- `published` and `updated`: "2026-10-03".

## New block type (in addition to p / ul / ol / tip / example)

```js
{ type: "table", caption: "optional short caption", head: ["Col A", "Col B"], rows: [["a1", "b1"], ["a2", "b2"]] }
```
Cells are strings (inline markup allowed). Keep tables ≤ 6 columns.

## Blog post — `content/blog/<slug>.js`

```js
export default {
  slug: "…",
  title: "…",                 // H1, ≤ 70 chars, main keyword near the front
  metaTitle: "…",             // ≤ 60 chars, no brand
  description: "…",           // 140–158 chars
  excerpt: "…",               // 1–2 sentences for cards
  category: "Getting clients" | "Cold outreach" | "Pricing & proposals" | "Growing your business",
  published: "2026-10-03",
  updated: "2026-10-03",
  readingMinutes: 8,
  answer: "…",                // 40–70 words, standalone direct answer (see rules)
  keyTakeaways: ["…", "…", "…"],              // 3–5
  sections: [ { heading: "…", blocks: [ … ] }, … ],   // 6–10 sections
  howTo: null | { name: "…", steps: [ { name: "short step name", text: "1–2 sentences" }, … ] },  // ONLY for genuinely step-by-step posts (4–8 steps); otherwise null
  faqs: [ { q: "…", a: "…" }, … ],            // 4–6 real questions, answers 40–80 words, each answer standalone
  sources: [ { label: "…", url: "https://…" } ],  // optional; ONLY official/primary sources you are sure exist (regulators, official docs). [] if none.
  related: { guides: [], blog: [], templates: [], professions: [], glossary: [] }   // slugs from the lists below only
}
```
Length: **1,300–2,000 words** of body text.

## Glossary term — `content/glossary/<slug>.js`

```js
export default {
  slug: "buying-signal",
  term: "Buying signal",
  metaTitle: "What is a buying signal? Definition & examples",   // ≤ 60 chars
  description: "…",           // 140–158 chars
  short: "…",                 // one-sentence definition, ≤ 30 words, starts with the term: "A buying signal is…"
  blocks: [ … ],              // 180–400 words: why it matters for freelancers/agencies, how it works, pitfalls
  example: "…",               // a concrete, clearly fictional example (1–3 sentences)
  related: { glossary: [], guides: [], blog: [], templates: [] }
}
```

## Slug lists (valid internal links — in addition to those in CONTENT_SPEC.md)

Blog (`/blog/<slug>`):
- get-your-first-freelance-client — zero-to-first-client playbook (no portfolio, no network)
- how-much-to-charge-as-a-freelancer — method for setting rates (cost floor, market check, value), hourly vs day vs project; examples clearly illustrative
- fixed-price-vs-hourly — when each wins, how to scope fixed-price safely, change requests
- how-to-write-a-freelance-proposal — structure, what to cut, pricing options, example skeleton
- discovery-call-questions — questions to ask on a sales/discovery call, in order, with why
- handle-price-objections — "too expensive", "need to think", "can you do it cheaper" — responses
- upwork-alternatives — where to find clients beyond Upwork/Fiverr: direct outreach, communities, niche boards, partnerships (no fake claims about platform fees)
- best-places-to-find-freelance-clients — ranked list of channels with effort/speed/fit table
- find-international-clients — getting foreign (US/UK/EU/Gulf) clients from countries like Pakistan, India, Nigeria, Philippines: positioning, time zones, trust, payments (generic: invoicing platforms, keep facts safe)
- find-local-business-clients — local clients: Google Maps research, walk-ins, chambers, local SEO angle
- linkedin-without-sales-navigator — prospecting on LinkedIn with a free account: search operators, filters, content
- cold-email-subject-lines — principles + 30 example subject lines by situation (table), what to avoid
- best-time-to-send-cold-emails — honest answer (it depends), how to test, time zones, cadence; no fake stats
- cold-email-deliverability — SPF, DKIM, DMARC, separate domain, warm-up, volume, plain text, list hygiene
- how-many-cold-emails-per-day — safe volumes per mailbox, ramping, why quality beats volume
- cold-calling-for-freelancers — when phone works, a short script, gatekeepers, follow-up
- get-referrals-as-a-freelancer — systems for referrals and testimonials; when to ask
- follow-up-after-proposal — what to send after a proposal goes quiet, timing, examples
- niche-down-as-a-freelancer — choosing a niche, testing it, fears, examples
- freelance-portfolio-that-wins-clients — what to include, case-study format, no-client-work workaround
- case-study-template — a fill-in case study structure with an example
- get-retainer-clients — turning projects into retainers: offers, pricing logic, scoping
- freelancer-to-agency — when and how to grow: subcontractors, process, pricing, risks
- social-selling-for-freelancers — finding clients via content on LinkedIn/X/Instagram without being spammy
- ai-for-finding-clients — using AI for prospecting research, personalization, and its limits/ethics
- chatgpt-prompts-for-cold-outreach — 15+ copyable prompts (as example blocks) for research, drafting, follow-ups, with caveats
- lead-generation-for-agencies — inbound vs outbound vs partnerships for small agencies, a weekly plan
- inbound-vs-outbound — definitions, pros/cons table, which to start with as a freelancer
- write-a-value-proposition — one-line value proposition formulas with examples by profession
- freelance-contract-essentials — clauses to include (scope, payment terms, IP, revisions, termination); "not legal advice"

Glossary (`/glossary/<slug>`):
buying-signal, ideal-customer-profile, lead-qualification, bant, cold-email, warm-lead, email-deliverability,
spf-record, dkim, dmarc, email-warm-up, reply-rate, can-spam, legitimate-interest, pecr, casl,
inbound-marketing, outbound-prospecting, sales-pipeline, crm, follow-up-cadence, value-proposition,
retainer, discovery-call, statement-of-work
