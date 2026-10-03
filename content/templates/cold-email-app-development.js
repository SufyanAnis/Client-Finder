export default {
  slug: "cold-email-app-development",
  title: "Cold email template: mobile app development pitch",
  metaTitle: "App Development Cold Email Template for Freelancers",
  description: "A cold email template for pitching app work to businesses whose customers struggle with a clunky mobile flow. Includes variations and a full example.",
  channel: "Email",
  useCase: "Send this when a business has a repeat-use customer journey (ordering, booking, tracking, loyalty) that is clearly painful on mobile, or when their existing app has recent complaints in public reviews.",
  intro: [
    "Apps are expensive, and most small businesses don't need one. A cold email that says 'have you thought about building an app?' asks the reader to do all the thinking and tends to attract people with an idea and no budget. The businesses worth emailing are the ones where customers already come back often and already complain about the experience.",
    "There are two good openings. Either the company has no app and its mobile web flow is clumsy for something people do weekly, or it has an app whose store reviews point at a specific, fixable problem. This template handles both. It names the pattern you saw, keeps the scope small, and suggests a first step that doesn't commit them to a six-figure build. When you search in [FindMyClients](/), a launch or a product hire is a useful sign that a company is already spending on mobile."
  ],
  template: "Subject: {company}'s app reviews: '{short complaint}'\n\nHi {first name},\n\nI was reading {company}'s reviews in the {app store} and a pattern stood out: several recent ones mention {specific complaint}. For something customers use {how often}, that friction adds up, and it's showing in the rating.\n\nI build and fix mobile apps for {type of business}. Problems like this are often one screen or one API call, not a rewrite.\n\nIf it helps, I can spend an hour going through the app and send back a short list of likely causes and a rough size for each fix.\n\nWould that be useful?\n\n{your name}\n{portfolio link}",
  placeholders: [
    { key: "{first name}", fill: "Ideally the product owner, head of digital or a founder. In smaller firms the operations manager often owns the app relationship." },
    { key: "{short complaint}", fill: "A three-to-five word paraphrase of the review theme, like 'logs me out every time'. Paraphrase rather than quote a named reviewer." },
    { key: "{app store}", fill: "App Store or Google Play. If the complaints only appear on one platform, say so; it tells them you looked carefully." },
    { key: "{specific complaint}", fill: "The recurring issue in plain words: 'being logged out after every update', 'the reorder button not saving the last order', 'notifications arriving hours late'." },
    { key: "{how often}", fill: "Weekly, daily, every visit. This connects the bug to repeat revenue." },
    { key: "{type of business}", fill: "Narrow it: 'restaurant groups', 'gyms and studios', 'regional delivery services'." }
  ],
  whyItWorks: [
    "It uses evidence the company can check right now: their own public reviews. That's harder to dismiss than a generic opinion.",
    "It reframes the fix as small, which lowers the perceived risk of replying.",
    "Offering an hour of review with a 'rough size for each fix' gives them something they can take to a budget holder.",
    "It filters for businesses with an active user base, which are far more likely to pay for development than ones still 'thinking about an app'."
  ],
  variations: [
    { label: "No app yet (mobile web angle)", text: "Subject: reordering from {company} on a phone\n\nHi {first name},\n\nI tried reordering {product} from {company} on my phone. It took {number} screens and I had to re-enter my address each time. For something regulars buy every week, that's a lot of steps.\n\nYou may not need a full app. Sometimes saved details plus a faster mobile checkout does the job. I'd be happy to sketch both options with rough costs. Interested?\n\n{your name}" },
    { label: "Shorter version", text: "Subject: '{short complaint}'\n\nHi {first name},\n\nSeveral recent {app store} reviews for {company} mention {specific complaint}. That's often a small fix rather than a rebuild.\n\nI build apps for {type of business}. Want me to take an hour, look into it, and send you likely causes and rough sizes?\n\n{your name}" }
  ],
  filledExample: {
    context: "A freelance mobile developer notices that recent Google Play reviews for Brightfield Gym's member app complain about class bookings not saving.",
    text: "Subject: Brightfield Gym's app reviews: 'booking disappears'\n\nHi Marcus,\n\nI was reading Brightfield Gym's reviews in Google Play and a pattern stood out: several recent ones mention class bookings vanishing after the confirmation screen. For something members use three or four times a week, that friction adds up, and it's showing in the rating.\n\nI build and fix mobile apps for gyms and fitness studios. Problems like this are often one screen or one API call, not a rewrite.\n\nIf it helps, I can spend an hour going through the app and send back a short list of likely causes and a rough size for each fix.\n\nWould that be useful?\n\nLena Varga\nlenavarga.dev"
  },
  mistakes: [
    "Pitching a full rebuild in the first message. Even if the codebase is a mess, nobody signs off on a rewrite from a stranger's email.",
    "Quoting individual reviewers by name. It can feel like you're airing their dirty laundry. Summarize the theme instead.",
    "Emailing businesses with no repeat customer behavior. A one-off purchase business rarely benefits from an app, and the conversation will stall on value.",
    "Leading with your stack ('Flutter, React Native, Swift, Kotlin...'). They care that the booking works, not what it's written in."
  ],
  followUp: "Give it about a week. A good follow-up checks whether the problem is still there: install the app or reread the newest reviews, then write two lines saying what you found ('still seeing the same complaint in reviews from this week'). If you can reproduce the bug yourself, mention the exact steps. That's genuinely useful to their team even if they never hire you, and it often gets forwarded internally. After a second unanswered note, close the loop politely and move on.",
  related: {
    guides: ["buying-signals", "cold-email-that-gets-replies", "lead-qualification"],
    templates: ["cold-email-website-redesign", "cold-email-funding-signal", "follow-up-email"],
    professions: ["mobile-app-developers", "ux-designers"]
  }
};
