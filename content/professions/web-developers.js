export default {
  slug: "web-developers",
  name: "Web developers",
  singular: "web developer",
  title: "How to find clients as a web developer",
  metaTitle: "How to Find Clients as a Web Developer (2026 Guide)",
  description: "Find web development clients by spotting slow sites, broken checkouts and stalled dev hiring. Client types, buying signals, where to look and a sample email.",
  intro: [
    "Most companies that need a web developer don't say so in public. They say it indirectly: a checkout that throws an error on mobile, a careers page advertising a Senior Frontend Engineer for the third month running, a marketing team pasting tracking scripts into a WordPress theme nobody has updated since 2019. Read those clues before the buyer writes a brief, because once a brief exists they are collecting quotes from five other people.",
    "The good news is that development problems are unusually easy to verify from the outside. You can run a Lighthouse report, open the browser console, check the platform with a tech-detection extension and look at the public job board, all before you send a word. That means your first message can describe a specific technical problem on their site, which almost nobody else in their inbox is doing."
  ],
  bestClients: [
    { type: "Ecommerce brands doing roughly $500k to $10M a year on Shopify or WooCommerce", why: "They have outgrown themes and apps but can't justify a full in-house team. Custom sections, app replacement, subscription logic and checkout fixes have a direct revenue line attached, so the budget conversation is short." },
    { type: "Funded startups between seed and Series A with one or two engineers", why: "The core team is busy on the product, so the marketing site, docs, admin panels and integrations pile up. They need a contractor who can ship in their stack without a month of onboarding." },
    { type: "Agencies that sell design and marketing but not engineering", why: "Branding and paid-media agencies regularly win projects that need a build. A dependable white-label developer becomes recurring work without you ever pitching an end client." },
    { type: "B2B service firms with lead forms wired to a CRM", why: "Law firms, logistics companies and SaaS-adjacent consultancies lose leads when a form-to-HubSpot or Salesforce integration silently breaks. They will pay to have it fixed and monitored." },
    { type: "Companies mid-migration off a legacy CMS or custom PHP build", why: "Drupal 7 sites, old Magento 1 stores and hand-rolled PHP apps carry real security and hosting risk. Migration projects are large, well defined and easy to scope in phases." }
  ],
  buyingSignals: [
    { signal: "Mobile Largest Contentful Paint over about 4 seconds on key pages", howToSpot: "Run PageSpeed Insights on the home page and a product or pricing page. Note the field data if it exists, since that reflects real visitors. A page builder plus six tracking scripts is the usual culprit." },
    { signal: "Open developer roles that keep getting reposted", howToSpot: "Check their careers page and the posting date on the job board. A frontend or full-stack role open for 6+ weeks means the work is waiting; offer to cover it on contract while they hire." },
    { signal: "Visible JavaScript errors or broken flows", howToSpot: "Open dev tools on the checkout, booking or contact form and watch the console. Submit a test form if it is a plain contact form. A 404 on a script or a form that never confirms is a concrete opener." },
    { signal: "Running an end-of-life platform or PHP version", howToSpot: "Tech-detection extensions such as Wappalyzer show the CMS, framework and sometimes the server version. Magento 1, Drupal 7, AngularJS and old jQuery versions are all clear migration candidates." },
    { signal: "A launch, rebrand or new product announced with no site change", howToSpot: "Their LinkedIn page or press section mentions a new product, region or pricing model, but the website still describes the old offer. Someone has to build those pages, and soon." },
    { signal: "Recent funding round", howToSpot: "Funding announcements on their blog, founder posts, or startup news sites. Fresh money usually means a hiring push and a new marketing site within the next quarter." }
  ],
  whereToLook: [
    { place: "Shopify and WooCommerce stores in a niche you know", how: "Search Google for niche terms plus 'powered by Shopify' or browse store directories, then run each store through PageSpeed. Note the specific issue on each slow one." },
    { place: "Job boards, filtered for contract-coverable roles", how: "Search Wellfound, LinkedIn Jobs and local boards for 'frontend developer', 'WordPress developer' or 'Next.js'. Small companies hiring their first or second developer are often happy to start with a contractor. See [job posts as leads](/guides/job-posts-as-leads)." },
    { place: "Agency partner pages and design agency portfolios", how: "Find design or branding studios whose portfolio shows great visuals but whose team page lists no engineers. Pitch yourself as the build partner, with a clear day rate and turnaround." },
    { place: "Product Hunt, Indie Hackers and launch posts", how: "Recent launches often run on a no-code template that the founder already wants to replace. Comments asking about a bug or a missing feature tell you exactly what to offer." }  ],
  pitchAngles: [
    "Revenue leak: show the exact step where checkout, booking or the lead form fails on mobile and estimate it in their terms, such as 'every mobile visitor who taps Pay sees this error'.",
    "Contract cover for a hire: 'You've had the frontend role open since June. I can take the backlog in your stack for 8 to 12 weeks while you find the right person.'",
    "Platform risk: an end-of-life CMS or PHP version is a security and hosting problem, not a style choice. Offer a phased migration with the first phase priced small.",
    "Speed as a marketing fix: if they run paid ads, a slow landing page wastes ad spend. Pitch a performance sprint on the top three landing pages only."
  ],
  sampleMessage: {
    channel: "Email",
    text: "Subject: Mobile checkout error on {company}\n\nHi {first name},\n\nI was looking at {company} on my phone and the Pay button on checkout throws a script error after the shipping step. It loads fine on desktop, so it is probably a theme app conflict rather than Shopify itself.\n\nI'm a Shopify developer and fix this kind of thing for small brands. I recorded a 40-second screen capture of what happens, with the console error, if that's useful to whoever looks after the store.\n\nWant me to send it over? No charge for the diagnosis.\n\nThanks,\n{your name}"
  },
  pricingNote: "Developers lose deals by quoting a big rebuild in the first reply. Offer a small, fixed-price first step instead: a performance sprint on three pages, a checkout bug fix, or a one-week paid audit with a written migration plan. The client tests how you work for a manageable amount, and the audit scopes the larger project for you. For contract cover, quote a day or weekly rate with a minimum term, and be clear about hours and response times. Avoid hourly billing on fixed problems; it punishes you for working fast.",
  mistakes: [
    "Leading with your stack ('I'm a MERN developer') instead of their problem. Buyers care about the broken checkout, not your framework preferences.",
    "Sending a Lighthouse score with no interpretation. A raw 38/100 means nothing to a founder; 'your product page takes about 7 seconds to show the image on a phone' does.",
    "Pitching a full rebuild when a targeted fix would solve 80% of the pain. It makes you look expensive and makes the decision slower.",
    "Emailing info@ about a technical issue. Find the founder, head of ecommerce or CTO, as covered in [finding business contact details](/guides/find-business-contact-details).",
    "Claiming you found a security vulnerability by probing their systems. Stick to what any visitor can see in a browser."
  ],
  toolPreset: { service: "Web development", niche: "Shopify ecommerce brands" },
  faqs: [
    { q: "Where do web developers find their first clients?", a: "Usually from people one step removed: former employers, agencies that need build capacity, and small businesses in a niche you already understand. After that, proactive outreach based on a visible problem on the prospect's site works better than bidding on marketplaces, because you arrive with a diagnosis rather than a quote." },
    { q: "Should I specialize in one platform to get more clients?", a: "Usually yes. 'Shopify developer for apparel brands' or 'Webflow to Next.js migrations' is easier to find leads for and easier to trust than 'full-stack developer'. Specializing also makes your buying signals sharper, because you know exactly which platform problems to look for." },
    { q: "Is it okay to point out bugs on a stranger's website?", a: "Yes, if you are helpful and specific and you only report what any visitor can see. Describe the issue, explain how to reproduce it, and offer a fix without pressure. Do not run scanners, test logins or poke at their servers. That crosses a line and can create legal problems for you." },
    { q: "How do I find web development clients without Upwork?", a: "Build a short list of companies with an observable problem, such as slow mobile pages, an old CMS or an open developer role, then contact the decision maker with a specific note. [FindMyClients](/) can run that search for you and score each company for fit. Agency partnerships and referrals from past clients are the other two reliable channels." }
  ],
  related: {
    guides: ["buying-signals", "job-posts-as-leads", "cold-email-that-gets-replies", "lead-qualification"],
    templates: ["cold-email-website-redesign", "cold-email-hiring-signal", "follow-up-email"],
    professions: ["web-designers", "mobile-app-developers", "seo-consultants"]
  }
};
