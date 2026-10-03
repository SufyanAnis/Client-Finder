export default {
  slug: "cold-email-seo-audit",
  title: "Cold email template: SEO audit offer",
  metaTitle: "SEO Audit Cold Email Template That Gets Replies",
  description: "A cold email template for SEO consultants that opens with one search they should be winning but aren't. Includes placeholders, variations and a full example.",
  channel: "Email",
  useCase: "Send this when a business ranks poorly for a search its customers clearly use, and you can show the gap with one or two specific queries.",
  intro: [
    "Business owners get a steady stream of emails promising 'page one of Google'. Most go straight to spam, and the ones that don't are ignored because they could have been sent to anyone. To stand out, your email has to prove you looked at their business and their market, not just ran their domain through a tool.",
    "The approach here is simple: pick one search a real customer would type, show where they appear compared with a local or direct competitor, and offer a short, free look at why. You're not selling an audit in the first email. You're showing that you understand how their customers search, which is the thing they're actually buying. To build a list of businesses worth checking, you can describe your niche in [FindMyClients](/) and start with the ones it scores highest."
  ],
  template: "Subject: '{search phrase}' in {city or market}\n\nHi {first name},\n\nI searched '{search phrase}' this morning, the kind of thing your customers type when they're ready to {buy or book}. {competitor} shows up {their position}; {company} {your position}.\n\nFrom a quick look, the main reason seems to be {likely cause}. That's usually fixable without a big rebuild.\n\nI do SEO for {type of business}. If you'd like, I'll put together a one-page note on the three changes I'd make first, with no obligation to hire me.\n\nShould I send it?\n\n{your name}",
  placeholders: [
    { key: "{search phrase}", fill: "A real, commercial query: 'emergency plumber Leeds', 'payroll software for restaurants'. Search it yourself in a private window and, for local queries, from the right location." },
    { key: "{city or market}", fill: "The area or niche the query applies to. Keep it consistent with the search phrase." },
    { key: "{buy or book}", fill: "The action that matters to them: 'book a consultation', 'request a quote', 'order online'." },
    { key: "{competitor}", fill: "Name a competitor only if it's a public, factual ranking. It makes the gap concrete. If naming them feels aggressive for this audience, say 'two nearby competitors' instead." },
    { key: "{their position} / {your position}", fill: "Plain descriptions: 'in the map pack and the first organic result', 'on page two, below a directory listing'. Rankings vary by person and location, so avoid exact numbers you can't stand behind." },
    { key: "{likely cause}", fill: "One specific, honest hypothesis: 'the service pages don't mention the areas you cover', 'your Google Business Profile has no category for emergency work', 'the site has one page for six different services'." }
  ],
  whyItWorks: [
    "The subject line is the search itself, which is oddly compelling to an owner: they immediately want to know how they look for it.",
    "Comparing against a competitor turns abstract SEO into something they feel. Nobody likes losing to the business down the road.",
    "Naming a single likely cause shows expertise without giving away a full audit or burying them in jargon.",
    "The one-page note is a specific, bounded offer. It is clearly more useful than 'hop on a call'."
  ],
  variations: [
    { label: "Shorter version", text: "Subject: '{search phrase}'\n\nHi {first name},\n\nWhen I search '{search phrase}', {competitor} comes up first and {company} doesn't appear on page one. I think it's mostly down to {likely cause}.\n\nI can send a one-page note on what I'd fix first. Free, no strings. Want it?\n\n{your name}" },
    { label: "Recent website relaunch angle", text: "Subject: {company}'s new site and old Google traffic\n\nHi {first name},\n\nCongrats on the new site. One thing I noticed: several of your old page addresses, like {old URL path}, now go to an error page instead of redirecting. Google had those pages indexed, so some of the rankings you'd built up may be quietly disappearing.\n\nIt's a quick fix if caught early. Want me to send the list I found?\n\n{your name}" }
  ],
  filledExample: {
    context: "An SEO consultant notices that Harbor Lane Plumbing, a fictional local firm, doesn't appear for a high-intent emergency query in its own town.",
    text: "Subject: 'emergency plumber Westbrook' in Westbrook\n\nHi Daniel,\n\nI searched 'emergency plumber Westbrook' this morning, the kind of thing your customers type when they need someone out within the hour. Tidewater Plumbing shows up in the map results and the first organic listing; Harbor Lane Plumbing is on page two, below two directory sites.\n\nFrom a quick look, the main reason seems to be that your site has one 'Services' page covering everything, with no page about emergency call-outs. That's usually fixable without a big rebuild.\n\nI do SEO for trades businesses. If you'd like, I'll put together a one-page note on the three changes I'd make first, with no obligation to hire me.\n\nShould I send it?\n\nAisha Rahman"
  },
  mistakes: [
    "Pasting a tool's 'SEO score' or a list of 40 technical warnings. Owners can't act on it, and it signals you didn't think about their customers.",
    "Promising rankings or traffic numbers. Nobody can guarantee a position, and experienced owners know that. It makes you look less credible, not more.",
    "Choosing a vanity keyword. Ranking for 'plumbing' is meaningless to a local firm; ranking for 'boiler repair' plus their town is money.",
    "Being snide about their current agency or developer. They may have hired them, and they may like them."
  ],
  followUp: "If you hear nothing after about a week, follow up by actually sending a slimmed-down version of what you offered: two of the three fixes, written plainly. It costs you fifteen minutes, it's genuinely useful, and it's the follow-up most likely to get a 'thanks, can we talk?' reply. If that gets no response either, one brief closing note a week or two later is enough. The [follow-up emails guide](/guides/follow-up-emails) covers timing in more detail.",
  related: {
    guides: ["cold-email-that-gets-replies", "ideal-client-profile", "follow-up-emails"],
    templates: ["cold-email-website-redesign", "follow-up-email", "cold-email-copywriting"],
    professions: ["seo-consultants", "marketing-agencies"]
  }
};
