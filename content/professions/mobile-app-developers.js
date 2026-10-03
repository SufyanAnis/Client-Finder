export default {
  slug: "mobile-app-developers",
  name: "Mobile app developers",
  singular: "mobile app developer",
  title: "How to find clients as a mobile app developer",
  metaTitle: "How to Find Clients as a Mobile App Developer",
  description: "Find app development clients through stale App Store listings, falling ratings and mobile hiring. Client types, buying signals and a sample cold email.",
  intro: [
    "App development leads leave an unusually detailed public trail. Every app has a store listing with a last-updated date, a rating trend and reviews where real users describe crashes, login loops and missing features in their own words. If an app hasn't shipped an update in fourteen months and the latest reviews say it crashes on the newest iOS, the company has a problem whether or not they have admitted it internally.",
    "The other big group of buyers has no app yet but is clearly heading towards one: a booking business taking orders over WhatsApp, a gym chain using a clunky white-label app, a SaaS product whose users keep asking for mobile in public forums. App projects are expensive and slow to decide, so your outreach should make the first step small and concrete, such as a fix sprint, an app audit or a clickable prototype, rather than asking someone to approve a six-month build from a cold email."
  ],
  bestClients: [
    { type: "Companies with a neglected app built by a former agency or employee", why: "The original developer is gone, updates have stopped and store policies keep moving. They need someone who can pick up an unfamiliar codebase, which is a skill many developers avoid and clients will pay for." },
    { type: "SaaS companies with web-only products", why: "Their customers ask for mobile access in reviews and community forums. A focused companion app, often in React Native or Flutter, is a well-scoped project with a product team to work with." },
    { type: "Fitness studios, clinics and service chains on white-label apps", why: "Generic booking apps carry another brand's look and limits. As these businesses grow they want their own app with loyalty, memberships and push notifications." },
    { type: "Retailers and restaurants with strong repeat customers", why: "Loyalty and reordering are where a native app beats a website. If they already run a points card or a WhatsApp ordering line, the app case is half made." },
    { type: "Funded startups with a mobile-first product and a thin team", why: "They need to ship to both stores quickly and often hire contractors for a specific platform, release or feature while recruiting." }
  ],
  buyingSignals: [
    { signal: "No app update in 9+ months", howToSpot: "Check the version history on the App Store and Google Play. Long gaps often mean nobody is maintaining the app, and both stores periodically require apps to target newer SDKs." },
    { signal: "Recent one-star reviews mentioning crashes or logins", howToSpot: "Sort reviews by most recent. Several reviews in the last month citing the same crash, a login loop or a broken payment screen is a specific, quotable problem." },
    { signal: "Developer reply to reviews says 'we're working on a fix' with no update since", howToSpot: "Look at the company's responses in the store. A promised fix with no release afterwards points to a team that has run out of capacity." },
    { signal: "Mobile developer roles open or reposted", howToSpot: "Search their careers page and job boards for iOS, Android, Flutter or React Native roles. A first mobile hire suggests they would accept contract help to ship sooner." },
    { signal: "Customers asking for an app in public", howToSpot: "Search the product's community forum, subreddit, X replies or G2 reviews for 'mobile app' or 'iOS'. Repeated requests tell you demand exists and the roadmap may already include it." },
    { signal: "Mobile web being used as a workaround", howToSpot: "A site banner saying 'add us to your home screen', ordering through WhatsApp or a web view wrapped as an app are all signs they want an app but haven't invested properly." }
  ],
  whereToLook: [
    { place: "App Store and Google Play category charts", how: "Browse a category you understand, such as health and fitness or food delivery, beyond the top 50. Mid-ranking apps with stale updates and falling ratings are realistic prospects; the giants have in-house teams." },
    { place: "Review sites for B2B software", how: "On G2 or Capterra, filter reviews of SaaS products for complaints about mobile. Companies whose users ask for an app are pre-qualified for a companion-app pitch." },
    { place: "Startup job boards and funding news", how: "Wellfound and LinkedIn Jobs filtered for Flutter, Swift or Kotlin show who is hiring mobile talent. Pair it with recent funding announcements to prioritize. The [funding signal template](/templates/cold-email-funding-signal) fits these leads." },
    { place: "Agencies without a mobile team", how: "Web and branding agencies get asked for apps and often say no. Approach them as a white-label mobile partner with a clear process for estimates and store submission." },
    { place: "Local service chains with many locations", how: "Gyms, salons and clinic groups with several branches are good candidates for a branded booking app. Check whether their current app shows another company's name in the store listing." }
  ],
  pitchAngles: [
    "Rescue and maintain: 'Your last update was in March of last year and recent reviews mention crashes on login. I take over inherited codebases and get them shipping again.'",
    "Store compliance: platform SDK and policy deadlines are real. Offer to handle the update before the app drops out of search or gets blocked for new installs.",
    "Companion app for a web product: quote the specific user requests you found and propose a small first version that covers the top two mobile tasks.",
    "Own your app: for businesses on a white-label booking app, pitch a branded app with loyalty and push notifications they control."
  ],
  sampleMessage: {
    channel: "Email",
    text: "Subject: Login crash in the {company} app reviews\n\nHi {first name},\n\nI noticed several App Store reviews from the past few weeks mentioning the {company} app crashing straight after login on iOS. Your team replied that a fix is coming, but the last release was in February.\n\nI'm a mobile developer who takes over existing React Native and Swift apps. I usually start with a short paid audit: reproduce the crash, review the codebase and give you a fix plan with a fixed price.\n\nWould it help if I sent over how that audit works?\n\nRegards,\n{your name}"
  },
  pricingNote: "App buyers have often been burned by a big quote that doubled, so lead with a small, fixed first engagement. For neglected apps, offer a paid code and store audit with a written fix plan; for new apps, offer a discovery sprint that ends in a clickable prototype and a phased estimate. Price the first step so a manager can approve it without a board meeting. Be explicit about what's excluded, such as backend work, design, store fees and ongoing maintenance, and offer maintenance as a monthly retainer once the app is stable.",
  mistakes: [
    "Pitching a full rebuild of an app you haven't seen the code for. Offer to assess first; rewrites are a hard sell and often unnecessary.",
    "Quoting reviews out of context or exaggerating them. Use their exact words and dates so the founder can check in seconds.",
    "Talking about Flutter versus native in the first message. The buyer wants a working app, not a framework debate.",
    "Ignoring the backend. Many app problems are API or authentication issues; say early whether you cover them or partner with someone who does.",
    "Targeting top-ranked apps from big brands. Mid-sized companies with a stale app are far more likely to reply."
  ],
  toolPreset: { service: "Mobile app development", niche: "fitness studios and gym chains" },
  faqs: [
    { q: "How do mobile app developers find clients?", a: "The most reliable source is existing apps that need help: stale updates, falling ratings and unresolved crash reviews are all visible in the stores. Add companies hiring mobile developers, SaaS products whose users ask for an app, and agencies without a mobile team. [FindMyClients](/) can search for these signals and score leads by fit." },
    { q: "Is maintaining old apps a good niche?", a: "It is one of the steadier niches in mobile. Many developers prefer new builds, so companies with an inherited app struggle to find help. The work often starts with an audit, moves to fixes and becomes a monthly retainer covering OS updates, store policy changes and small features." },
    { q: "Should I specialize in iOS, Android or cross-platform?", a: "Choose based on the clients you want. Startups and small businesses often prefer React Native or Flutter so one team covers both stores. Larger companies with existing native apps hire Swift or Kotlin specialists. Whatever you choose, say it plainly in your profile so the right leads self-select." },
    { q: "How do I find the decision maker for an app?", a: "The store listing shows the developer account name and often a support email and privacy policy link. From there, find the founder, head of product or CTO on the company's site or LinkedIn. Use [finding business contact details](/guides/find-business-contact-details) for an ethical process." }
  ],
  related: {
    guides: ["buying-signals", "job-posts-as-leads", "lead-qualification", "find-business-contact-details"],
    templates: ["cold-email-app-development", "cold-email-funding-signal", "cold-email-hiring-signal"],
    professions: ["web-developers", "ux-designers", "ai-automation-consultants"]
  }
};
