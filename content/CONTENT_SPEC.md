# FindMyClients content spec

FindMyClients (https://findmyclients.vercel.app) is a free web tool for **freelancers and small agencies**
(developers, designers, marketers, writers, consultants…). You describe what you sell and who you want
to work with; it searches the live web for real companies showing a *current* need (hiring for the role,
just raised money, launching something, an obvious gap like a slow or dated site), scores each 0–100 for
fit, writes a personalized first message (Email / LinkedIn / WhatsApp), and keeps a pipeline you can export
to Excel. Free users get a few searches per day. It never sends anything — the user reviews and sends.
Contact details it shows are only public ones (generic company email, main phone, company LinkedIn).

The content exists to (1) genuinely help freelancers win clients, (2) rank in Google, and (3) pass Google
AdSense review. AdSense rejects thin, generic, or AI-sounding pages, so the bar is: **specific, practical,
original, written by someone who has actually done client outreach.**

## Quality rules (all content)

- Concrete over generic. Real steps, real example messages, real numbers *only when they are well known and
  safe* (e.g. "CAN-SPAM requires a physical postal address"). **Never invent statistics, studies, survey
  results, quotes, or named customers.** No "studies show 80%…". If you want to give a number, frame it as a
  rule of thumb ("keep cold emails under ~120 words").
- No filler intros ("In today's fast-paced digital world…"), no "In conclusion", no "Let's dive in", no
  "game-changer", "unlock", "leverage", "seamless", "elevate", "robust", "delve". Plain, direct, a little
  opinionated. Second person ("you").
- Mention FindMyClients naturally where it actually helps (usually 1–3 times per page, e.g. "you can run this
  search in [FindMyClients](/)"), never as a hard sell. Most of each page must be useful without the tool.
- Write for a global audience (UK, US, EU, Gulf, South Asia freelancers). Use neutral spelling consistently
  (US spelling is fine).
- Legal topics: be accurate and conservative, say "this is not legal advice", and point to the official
  regulator name (FTC for CAN-SPAM, ICO for PECR/UK GDPR, etc.). Don't quote fine amounts unless you're sure.
- Internal links: link to other pages ONLY with slugs from the lists below, using paths `/guides/<slug>`,
  `/templates/<slug>`, `/find-clients/<slug>`, or `/` for the tool. Do not link to slugs not listed.
  External links: only to stable official sources (ftc.gov, ico.org.uk, gdpr.eu is NOT official — prefer
  eur-lex or ico) and only if clearly useful; otherwise none.
- Dates: use `"2026-10-03"` for `updated`.

## File format

Each item is its own ES module file exporting a default plain object (no imports, no functions, no JSX).
Strings may contain this inline markup ONLY:
- `**bold**`
- `[link text](/path)` or `[link text](https://…)`
Nothing else (no headings, no HTML, no backticks, no *single-asterisk italics*).

Escape properly: prefer double-quoted JS strings or template literals without `${`. The file must be valid
JavaScript that `node --input-type=module -e "import('./file.js')"` can load.

### Shared "blocks" (used inside sections)

```js
{ type: "p", text: "Paragraph text with **bold** and [links](/guides/x)." }
{ type: "ul", items: ["bullet", "bullet"] }
{ type: "ol", items: ["step one", "step two"] }
{ type: "tip", text: "A short callout / pro tip." }
{ type: "example", label: "Cold email — redesign angle", text: "Subject: …\n\nHi {first name},\n\n…" }  // pre-formatted, newlines kept
```

### Guide — `content/guides/<slug>.js`

```js
export default {
  slug: "how-to-find-clients-as-a-freelancer",
  title: "…",                     // H1, ≤ 70 chars, contains the main keyword
  metaTitle: "…",                 // ≤ 60 chars (brand is appended automatically, don't add it)
  description: "…",               // meta description, 140–158 chars
  excerpt: "…",                   // 1–2 sentences for cards
  category: "Prospecting" | "Outreach" | "Strategy" | "Compliance",
  updated: "2026-10-03",
  readingMinutes: 9,              // honest estimate at ~230 wpm
  keyTakeaways: ["…", "…", "…"],  // 3–5 bullets shown at top
  sections: [ { heading: "…", blocks: [ /* blocks */ ] }, … ],   // 6–10 sections, H2 headings
  faqs: [ { q: "…", a: "…" }, … ], // 4–6, real questions people search; answers 40–90 words, plain text (inline markup ok)
  related: { guides: ["slug", "slug"], templates: ["slug"], professions: ["slug"] }
}
```
Length: **1,400–2,200 words** of body text per guide.

### Profession page — `content/professions/<slug>.js`

Target keyword: "how to find clients as a <profession>" / "find clients for <profession>".

```js
export default {
  slug: "web-developers",
  name: "Web developers",          // plural, used in "Find clients for {name}"
  singular: "web developer",
  title: "How to find clients as a web developer",      // H1
  metaTitle: "…",                  // ≤ 60 chars
  description: "…",                // 140–158 chars
  intro: ["paragraph", "paragraph"],                     // 2 paragraphs, specific to this profession
  bestClients: [ { type: "…", why: "…" }, … ],            // 4–6 client types that buy this service and why
  buyingSignals: [ { signal: "…", howToSpot: "…" }, … ],  // 5–7 concrete, observable signals
  whereToLook: [ { place: "…", how: "…" }, … ],           // 4–6 places/tactics, specific (not just "LinkedIn")
  pitchAngles: ["…", "…", "…"],                          // 3–5 angles that work for this service
  sampleMessage: { channel: "Email", text: "Subject: …\n\nHi {first name},\n\n…" },  // 80–130 words, uses a real-looking but generic signal, sign-off "{your name}"
  pricingNote: "…",                // 1 paragraph: how to talk about price / first project size for this service; no invented market-rate stats
  mistakes: ["…", "…", "…", "…"],  // 4–5 common outreach mistakes for this profession
  toolPreset: { service: "…", niche: "…" },   // prefill for the tool; service MUST be one of the SERVICE PRESETS below; niche = a good example niche
  faqs: [ { q: "…", a: "…" }, … ], // 4–5
  related: { guides: ["slug", …], templates: ["slug", …], professions: ["slug", …] }
}
```
Length: **900–1,400 words** total. Each profession page must be clearly different from the others — different
client types, signals and angles. Do not reuse sentences across pages.

### Template — `content/templates/<slug>.js`

```js
export default {
  slug: "cold-email-website-redesign",
  title: "…",                      // H1, e.g. "Cold email template: website redesign pitch"
  metaTitle: "…",                  // ≤ 60 chars
  description: "…",                // 140–158 chars
  channel: "Email" | "LinkedIn" | "WhatsApp",
  useCase: "…",                    // one sentence: when to send this
  intro: ["paragraph", "paragraph"],
  template: "Subject: …\n\nHi {first name},\n\n…",   // the main template, placeholders in {curly braces}
  placeholders: [ { key: "{first name}", fill: "how to fill it well" }, … ],
  whyItWorks: ["…", "…", "…"],     // 3–5
  variations: [ { label: "Shorter version", text: "…" }, { label: "…", text: "…" } ],   // 2–3
  filledExample: { context: "one sentence describing a fictional but realistic situation", text: "the template filled in" },  // use clearly fictional company names like "Northgate Dental" — never real companies
  mistakes: ["…", "…", "…"],       // 3–4
  followUp: "…",                   // 1 paragraph: when/how to follow up if no reply
  related: { guides: ["slug", …], templates: ["slug", …], professions: ["slug", …] }
}
```
Length: **600–1,000 words** total. Templates: Email 70–130 words, LinkedIn connection notes ≤ 300 characters,
LinkedIn messages 40–90 words, WhatsApp 30–70 words.

## Service presets (for `toolPreset.service`)

"Web development", "Web design", "Mobile app development", "SEO", "Graphic design & branding",
"Copywriting & content", "Video editing & production", "Social media management", "UX/UI design",
"Marketing agency services", "Bookkeeping & accounting", "AI & automation"

## Slug lists (the ONLY valid internal links)

Guides (`/guides/<slug>`):
- how-to-find-clients-as-a-freelancer — the pillar: a complete system for finding clients
- cold-email-that-gets-replies — writing cold emails: structure, length, subject lines, personalization
- buying-signals — spotting companies that need you *now* (hiring, funding, launches, tech gaps)
- ideal-client-profile — defining an ICP as a freelancer/agency, with a worksheet
- linkedin-outreach-for-freelancers — profile, connection notes, DMs, cadence, what not to do
- whatsapp-business-outreach — when WhatsApp outreach is acceptable (Gulf/South Asia/LatAm norms), etiquette, opt-out
- follow-up-emails — how many follow-ups, timing, what to say, breakup email
- cold-outreach-laws — CAN-SPAM, GDPR/UK GDPR + PECR, CASL basics for B2B cold outreach (not legal advice)
- lead-qualification — scoring fit, BANT-lite for freelancers, red flags, saying no
- find-business-contact-details — finding the right person and public contact info ethically (no scraping behind logins, role addresses, verifying)
- job-posts-as-leads — turning "we're hiring X" posts into project/contract work
- track-leads-in-a-spreadsheet — a simple outreach pipeline/CRM in a spreadsheet: columns, stages, weekly routine

Profession pages (`/find-clients/<slug>`):
web-developers, web-designers, mobile-app-developers, seo-consultants, graphic-designers, copywriters,
video-editors, social-media-managers, ux-designers, marketing-agencies, bookkeepers, ai-automation-consultants

Templates (`/templates/<slug>`):
- cold-email-website-redesign
- cold-email-seo-audit
- cold-email-app-development
- cold-email-hiring-signal — company is hiring a role you can cover as a contractor
- cold-email-funding-signal — company just raised money
- cold-email-copywriting
- cold-email-video-production
- cold-email-social-media
- cold-email-ai-automation
- linkedin-connection-request
- linkedin-message-after-connecting
- whatsapp-first-message
- follow-up-email
- breakup-email
- referral-request-email
