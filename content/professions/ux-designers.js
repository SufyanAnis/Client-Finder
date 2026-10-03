export default {
  slug: "ux-designers",
  name: "UX designers",
  singular: "UX designer",
  title: "How to find clients as a UX designer",
  metaTitle: "How to Find Clients as a UX/UI Designer",
  description: "Find freelance UX/UI design clients: early-stage startups, SaaS teams with clunky onboarding, apps with poor reviews. The signals to watch and how to pitch.",
  intro: [
    "Freelance UX work has an awkward sales problem: the people who need it most often do not know the word for it. A founder will say 'our signup is confusing' or 'users keep emailing support about the same screen', not 'we need a usability audit'. If your outreach leads with research methods, personas and design systems, you lose them. If it leads with a specific friction point in their product that is costing them users, you get a reply.",
    "Your best prospects are software products with real users and a visible problem: app store reviews complaining about navigation, a pricing page that hides the plans, an onboarding flow that asks for a credit card before showing anything. Because most SaaS products offer free trials and most apps are free to download, you can walk through the experience yourself before you ever write to them. That walkthrough is your strongest prospecting asset."
  ],
  bestClients: [
    { type: "Seed and Series A startups without a designer", why: "Engineers built the first version, the product works, and now growth is stalling at signup or activation. They need design maturity but cannot yet justify a full-time senior hire." },
    { type: "B2B SaaS companies with a complex product", why: "Dashboards, permissions, reporting and settings pages accumulate over years. These teams need someone to untangle flows, and the value of reducing support tickets or churn is easy to quantify internally." },
    { type: "Consumer apps with poor store ratings", why: "Public reviews spell out exactly where users get stuck. A team watching its rating drop is motivated to fix the experience and can measure whether it worked." },
    { type: "Development agencies without in-house UX", why: "Dev shops win build projects and then need wireframes and interface designs before engineering can start. Becoming their go-to UX partner can bring repeat projects without you doing sales each time." },
    { type: "Established non-tech businesses launching portals", why: "Insurers, logistics firms, clinics and schools building customer or staff portals often have budget and a developer, but nobody thinking about how real users will move through the screens." }
  ],
  buyingSignals: [
    { signal: "App store reviews mentioning confusion, not bugs", howToSpot: "Read recent one- and two-star reviews. Phrases like 'can't find', 'too many steps', 'where is the setting' point to design problems rather than crashes, which is your territory." },
    { signal: "A product redesign or v2 announced on the roadmap or blog", howToSpot: "Changelogs, public roadmaps and founder posts that mention 'rebuilding the dashboard' or 'new onboarding' signal an upcoming project, often before a designer is in place." },
    { signal: "Hiring a first product designer", howToSpot: "A small company posting its first product or UX designer role is admitting it needs design help now. Hiring takes months, so a contractor can bridge the gap or cover a specific flow." },
    { signal: "Recent funding with a small team", howToSpot: "Funding announcements for companies with fewer than 20 people often precede a push on growth. Investors frequently ask about activation and retention, which are UX problems." },
    { signal: "A signup or checkout flow with obvious friction", howToSpot: "Sign up for their free trial. Count the steps, note forced fields, missing progress indicators, unclear errors and dead ends on mobile. If you hit friction, so do their users." },
    { signal: "Help center articles explaining basic tasks", howToSpot: "A knowledge base full of articles like 'How to find your invoices' often means the interface does not make those tasks obvious, and support is absorbing the cost." }
  ],
  whereToLook: [
    { place: "Product launch sites", how: "Browse recent launches on Product Hunt and similar directories in a category you understand. Comments often include early users pointing out UX issues, and makers are usually reachable and responsive." },
    { place: "App stores by category and recent update", how: "Look at apps in a vertical such as fitness, fintech or property, sorted by recent update, with ratings in the 3.0 to 4.0 range. They have users and active development, plus fixable complaints." },
    { place: "Startup databases and accelerator cohorts", how: "Accelerator demo day lists and startup directories show young companies by sector. Check their team page: no designer listed and a live product is a promising combination." },
    { place: "Development agency partner pages", how: "Search for web and app development agencies in your region and look at their team and services pages. If they offer 'design' but list only developers, they likely subcontract it." }  ],
  pitchAngles: [
    "Activation: pinpoint the step in their signup or onboarding where a new user is likely to give up, and propose redesigning that one flow first.",
    "Support load: if users keep asking how to do basic tasks, a clearer interface reduces tickets, which the operations team will feel quickly.",
    "Bridge before the hire: cover a specific flow or audit now while they search for a full-time designer, then hand over clean files and documentation.",
    "Design partner for developers: give dev agencies wireframes and interface designs their engineers can build from, so they can take on more projects."
  ],
  sampleMessage: {
    channel: "Email",
    text: "Subject: Your trial signup on mobile\n\nHi {first name},\n\nI signed up for your free trial on my phone this morning. The product itself looks strong, but the signup asks for company size, role and a phone number before showing anything, and the 'Continue' button sat below the keyboard on two screens.\n\nI'm a freelance UX designer working with early-stage SaaS teams on onboarding and activation. I've noted five specific friction points from that walkthrough, with quick sketches of how each could work.\n\nHappy to send the notes over. If they're useful, we can talk about a small project; if not, keep them anyway.\n\n{your name}"
  },
  pricingNote: "Clients find UX pricing hard to judge because the output is not as tangible as a website or a logo. Make it tangible by scoping around a flow or an outcome: 'redesign the onboarding from signup to first project created' or 'usability review of the checkout with ten prioritized fixes'. A fixed-price audit or single-flow redesign makes a good first project because it has a clear end. Later work can be priced per phase or as a monthly retainer. Say whether usability testing is included, since recruiting participants adds time and cost, and what files developers will receive.",
  mistakes: [
    "Leading with process jargon. Founders care about drop-off, support tickets and conversion; save talk of personas and journey maps for after they are interested.",
    "Sending a Dribbble-style portfolio of polished screens with no explanation of the problem or result. Show one case study with before, after and why.",
    "Criticizing without testing it yourself. If you have not signed up or downloaded the app, your observations will be shallow and easy to dismiss.",
    "Ignoring developer handoff. Teams that have been burned by beautiful but unbuildable designs want to know you work with real components and constraints."
  ],
  toolPreset: { service: "UX/UI design", niche: "Early-stage B2B SaaS startups" },
  faqs: [
    { q: "How do I get freelance UX design clients without a big portfolio?", a: "Do a few self-initiated teardowns of real products: sign up, document friction points with screenshots, and propose improvements with rationale. Then send short, relevant versions of that analysis to companies with similar products. A thoughtful critique of a prospect's own flow is more persuasive than ten unrelated case studies, and it shows how you think, not just how screens look." },
    { q: "Is a free UX audit a good way to land clients?", a: "A short, focused set of observations works well: three to five specific friction points with screenshots and a brief suggestion for each. It proves you looked closely. Avoid producing a full redesign or a long report for free. The goal is to start a conversation about a paid project, not to hand over the project itself." },
    { q: "What kind of companies hire freelance UX designers?", a: "Mostly startups without a design team, SaaS companies with growing complexity, app teams dealing with poor reviews, development agencies that need design partners, and established businesses building their first portal or app. The common thread is a live product with real users and a measurable problem, such as signup drop-off or support volume." },
    { q: "Should I contact the CEO or the product manager?", a: "At companies under about 20 people, the founder or CEO usually makes design decisions, so contact them directly. In larger companies, a head of product or product manager owns the experience and the budget for design help. Check the team page and LinkedIn; see the guide on [finding the right contact](/guides/find-business-contact-details) for ethical ways to do this." }
  ],
  related: {
    guides: ["buying-signals", "cold-email-that-gets-replies", "find-business-contact-details", "linkedin-outreach-for-freelancers"],
    templates: ["cold-email-funding-signal", "cold-email-hiring-signal", "linkedin-connection-request"],
    professions: ["web-designers", "mobile-app-developers", "web-developers"]
  }
};
