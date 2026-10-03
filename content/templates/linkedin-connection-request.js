export default {
  slug: "linkedin-connection-request",
  title: "LinkedIn connection request template for freelancers",
  metaTitle: "LinkedIn Connection Request Template (Under 300 Chars)",
  description: "Short LinkedIn connection note templates for freelancers that reference something real and don't pitch. Under 300 characters, with variations and an example.",
  channel: "LinkedIn",
  useCase: "Send this when you want to connect with a decision-maker at a prospect company before you've ever spoken, and you have one genuine reason to connect.",
  intro: [
    "The connection note has one job: get accepted. That's it. The moment it contains a pitch, the person on the other end knows exactly what happens next, a sales message, and many will ignore the request. A note that references something real about them, with no ask, gets accepted far more often and makes your later message feel like a conversation instead of an ambush.",
    "LinkedIn caps connection notes at 300 characters, and on some account types the limit is lower or notes are restricted, so keep yours well under. One sentence about them, one about why you're connecting, done. The selling happens later, if at all, in the [message after connecting](/templates/linkedin-message-after-connecting). Our [LinkedIn outreach guide](/guides/linkedin-outreach-for-freelancers) covers profile setup and cadence."
  ],
  template: "Hi {first name}, I enjoyed your post about {specific topic}, especially the point on {detail}. I work with {type of company} on {your area}, so it's a topic I think about a lot. Would be good to connect.",
  placeholders: [
    { key: "{first name}", fill: "Their first name as it appears on their profile." },
    { key: "{specific topic}", fill: "A real post, comment or article of theirs from the last month or two. If they don't post, use a company milestone instead (see variations)." },
    { key: "{detail}", fill: "A specific idea from the post, in four to eight words, like 'hiring for attitude over tools'. This is what proves you read it." },
    { key: "{type of company}", fill: "Who you serve, briefly: 'SaaS startups', 'architecture practices'." },
    { key: "{your area}", fill: "Your field in two or three words: 'onboarding design', 'paid search', 'bookkeeping'." }
  ],
  whyItWorks: [
    "It's about them first. Referencing a specific detail signals you're a person, not an automation tool.",
    "There's no ask, so there's nothing to decline. Accepting costs them nothing.",
    "Mentioning your field quietly gives context for why you're connecting without turning it into a pitch.",
    "It fits comfortably under the 300-character limit, so it never gets cut off."
  ],
  variations: [
    { label: "Company milestone (they don't post)", text: "Hi {first name}, congrats on {company}'s {milestone}. I work with {type of company} on {your area} and follow the space closely. Would be good to connect." },
    { label: "Shared context", text: "Hi {first name}, I see we're both in {shared group or event}. I liked your question about {topic} there. I help {type of company} with {your area}. Happy to connect." },
    { label: "Minimal", text: "Hi {first name}, your post on {specific topic} was a useful read. I work in {your area} with {type of company}. Would be good to connect." }
  ],
  filledExample: {
    context: "A freelance UX designer wants to connect with the head of product at Quillstone Health, a fictional patient-scheduling startup, after reading her post on reducing no-shows.",
    text: "Hi Fatima, I enjoyed your post about reducing appointment no-shows, especially the point on reminder timing beating reminder frequency. I work with health startups on onboarding design, so it's a topic I think about a lot. Would be good to connect."
  },
  mistakes: [
    "Pitching in the note ('I help companies like yours increase conversions by...'). It's the fastest way to get ignored or reported.",
    "Using a generic line like 'I'd love to add you to my professional network'. It reads as automated and earns nothing.",
    "Praising a post you didn't read. If the detail you reference is vague or wrong, it's worse than no note at all.",
    "Sending dozens of requests a day. LinkedIn limits weekly invitations and may restrict accounts with many ignored requests, so be selective."
  ],
  followUp: "Don't follow up on a connection request; if it isn't accepted within two or three weeks, withdraw it and let it go, or reach the company by email instead. If it is accepted, wait a day or two, then send a short message that continues the thread you started. Ideally reply to their next post with a thoughtful comment first. To pick which decision-makers to approach, you can run a search in [FindMyClients](/) and work through the highest-scored companies.",
  related: {
    guides: ["linkedin-outreach-for-freelancers", "find-business-contact-details", "ideal-client-profile"],
    templates: ["linkedin-message-after-connecting", "cold-email-funding-signal", "referral-request-email"],
    professions: ["ux-designers", "marketing-agencies", "ai-automation-consultants"]
  }
};
