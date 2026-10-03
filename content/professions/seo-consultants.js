export default {
  slug: "seo-consultants",
  name: "SEO consultants",
  singular: "SEO consultant",
  title: "How to find clients as an SEO consultant",
  metaTitle: "How to Find Clients as an SEO Consultant",
  description: "Find SEO clients by spotting botched migrations, thin location pages and lost rankings. Best client types, buying signals, pitch angles and a sample email.",
  intro: [
    "SEO has a reputation problem, and it shapes how you have to find clients. Every business owner with a contact form receives a steady stream of 'I can get you to page one of Google' emails, most of them automated and many of them from people who never looked at the site. If your outreach resembles that in any way, it's filtered out before the first sentence is read. The way through is to lead with something only a person who looked carefully could know.",
    "Fortunately, real SEO problems are often visible from the outside. A site that relaunched and lost its old URLs without redirects, a plumber ranking in one suburb but invisible in the five others they serve, a blog with three hundred posts competing for the same keyword, a new domain after a rebrand with the old one still indexed. Spot one of those, explain it in plain words and you're no longer one of the spam emails. You're the person who noticed."
  ],
  bestClients: [
    { type: "Businesses that recently migrated or redesigned their site", why: "Migrations are where traffic quietly disappears: changed URLs, lost redirects, noindex tags left on from staging. The owner may not connect the drop in enquiries to the new site yet, and the fix is time-sensitive." },
    { type: "Multi-location service businesses", why: "Plumbers, law firms, clinics and moving companies that serve many areas need location pages and Google Business Profiles that actually work. The gap between where they operate and where they rank is easy to show." },
    { type: "Ecommerce stores with large catalogs", why: "Faceted navigation, duplicate product pages and thin category content cause indexing problems that only grow with the catalog. Technical SEO has a clear revenue link here." },
    { type: "B2B SaaS companies publishing content without results", why: "They have a blog and a content budget but posts get little organic traffic. Strategy, topic selection and internal linking are worth paying for when content is already being produced." },
    { type: "Web design and development agencies", why: "They launch sites and get asked about rankings afterwards. A white-label SEO partner for migrations and post-launch audits brings repeat work without cold outreach." }
  ],
  buyingSignals: [
    { signal: "Recent redesign or domain change", howToSpot: "Look for a new design compared with the Wayback Machine, a rebrand announcement, or old URLs from search results that now 404 or redirect to the homepage. Site-wide homepage redirects are a classic migration error." },
    { signal: "Service areas listed but no pages for them", howToSpot: "The footer or contact page says they serve ten towns, but a site: search shows only one location page. Search the service plus each town and note where they don't appear at all." },
    { signal: "Weak or inconsistent Google Business Profile", howToSpot: "Check the Maps listing for missing categories, no recent photos, unanswered reviews, or a name, address and phone that differ from the website." },
    { signal: "Indexing problems visible in search results", howToSpot: "A site: search shows staging subdomains, tag and filter pages, or duplicate titles across many pages. Titles like 'Home' or 'Products' repeated across the site are easy to screenshot." },
    { signal: "Content team hiring or active blog with little organic reach", howToSpot: "They're hiring a content marketer, or publish weekly but posts rank for nothing meaningful in a free keyword tool. Effort without results is a strategy problem." },
    { signal: "Competitor took over a term they used to own", howToSpot: "If they're a known name in a niche but a newer competitor now appears above them for their main service term, there's a conversation to have about why." }
  ],
  whereToLook: [
    { place: "Searches in the client's own market", how: "Search the services your target clients sell, such as 'emergency electrician {town}', across several towns. Businesses that show up in one town but not the next ones over are perfect local SEO prospects." },
    { place: "Recent redesign announcements", how: "LinkedIn posts saying 'excited to launch our new website' are leads. Wait two or three weeks, then check whether old URLs redirect properly and whether key pages are indexed." },
    { place: "Web agencies' recent launches", how: "Agency portfolios list recent sites. Check them for migration issues, then approach the agency, not the client, as a partner who can handle the SEO side of launches." },
    { place: "Ecommerce stores in one vertical", how: "Pick a product niche, open a dozen stores, and run site: searches for duplicate or filter URLs. Large catalogs with indexing mess are worth a technical pitch." },
    { place: "Content-heavy B2B companies", how: "SaaS companies with active blogs but little organic visibility in a free keyword tool are candidates for a content strategy audit rather than more writing." }
  ],
  pitchAngles: [
    "Migration rescue: 'Your old service URLs now redirect to the homepage, so the pages that used to rank have effectively vanished.' Specific, urgent and fixable.",
    "Coverage map: show the towns they serve against where they rank. A simple table makes the gap obvious to a non-technical owner.",
    "Content that already exists: for blogs that underperform, pitch consolidating and fixing existing posts before writing new ones.",
    "Partner for agencies: offer pre-launch redirect mapping and post-launch checks for their client sites, priced per project."
  ],
  sampleMessage: {
    channel: "Email",
    text: "Subject: Old {company} service pages redirecting to the homepage\n\nHi {first name},\n\nCongratulations on the new site. While looking at it I noticed that several of your old service URLs from Google, like the boiler repair page, now redirect to the homepage instead of the matching new page.\n\nWhen that happens, Google tends to drop those pages from results, which can mean fewer enquiries over the next few months.\n\nI'm an SEO consultant who fixes migration issues. I put together a short list of the affected URLs. Want me to send it?\n\nThanks,\n{your name}"
  },
  pricingNote: "SEO buyers are suspicious of monthly retainers with vague deliverables, because many have paid for 'SEO' and received a report nobody read. Start with a defined first project: a migration fix, a technical audit with a prioritized action list, or a local SEO setup for a set number of locations. Fixed price, clear deliverables, a date. Once you've fixed something they can see, a retainer covering ongoing content, links and monitoring is much easier to sell. Never promise rankings or specific positions; promise the work and the reporting.",
  mistakes: [
    "Opening with 'I can get you to page one'. That phrase marks you as spam instantly.",
    "Sending an automated audit report with a score and hundreds of warnings. Owners can't act on it; pick the one or two issues that matter.",
    "Criticizing the agency that built the site. The owner chose them. Describe the problem, not who caused it.",
    "Guaranteeing rankings or traffic numbers. Google's own guidance on hiring an SEO warns that nobody can guarantee a top ranking, and you can't control it anyway.",
    "Pitching link building to a site with basic indexing problems. Fix what's broken first, then talk growth."
  ],
  toolPreset: { service: "SEO", niche: "multi-location home services companies" },
  faqs: [
    { q: "How do SEO consultants find clients without spamming?", a: "Look for visible problems such as botched redirects after a redesign, missing location pages or a messy Google Business Profile, then write a short, specific note explaining the problem and its effect in plain language. Specificity is what separates you from automated SEO spam. [FindMyClients](/) can surface companies showing these signals so you aren't checking sites one by one." },
    { q: "Is local SEO or technical SEO easier to sell?", a: "Local SEO is easier to explain to small business owners because the outcome, showing up in the towns they serve, is easy to picture. Technical SEO sells better to ecommerce and larger sites, where indexing issues have a clear revenue link. Pick the one that matches the clients you want." },
    { q: "Should I offer a free SEO audit?", a: "Offer a free observation, not a free audit. One or two specific issues in your first message prove you looked. A full audit is real work and should be paid, or at least saved until the prospect has shown interest and you've agreed what happens next." },
    { q: "What is a good first SEO project to offer?", a: "A fixed-scope fix tied to something they can see, such as cleaning up migration redirects, creating pages for missing service areas, or setting up and correcting Google Business Profiles. It shows results quickly and leads naturally to ongoing work if they're happy." }
  ],
  related: {
    guides: ["buying-signals", "cold-email-that-gets-replies", "ideal-client-profile", "follow-up-emails"],
    templates: ["cold-email-seo-audit", "follow-up-email", "breakup-email"],
    professions: ["web-developers", "copywriters", "marketing-agencies"]
  }
};
