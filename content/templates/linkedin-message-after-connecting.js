export default {
  slug: "linkedin-message-after-connecting",
  title: "LinkedIn message template: what to send after they accept",
  metaTitle: "LinkedIn Message After Connecting: Template + Example",
  description: "What to send after a prospect accepts your LinkedIn request: a short, low-pressure message template for freelancers, with variations and a realistic example.",
  channel: "LinkedIn",
  useCase: "Send this one to three days after a prospect accepts your connection request, when you have a relevant observation about their company and want to open a conversation.",
  intro: [
    "Everyone knows the pattern: accept a request, and within minutes a wall of text arrives pitching a service. It's why so many people now hesitate before accepting anyone. Your first message after connecting should break that pattern. Wait a little, keep it short, and make it about something happening at their company rather than about you.",
    "The structure here is: thank them briefly, mention one current thing (a launch, a hire, a problem you noticed), connect it to what you do in one line, and ask a question that's easy to answer. On LinkedIn, aim for about 40 to 90 words; anything longer looks like a template on a phone screen, even when it isn't."
  ],
  template: "Thanks for connecting, {first name}.\n\nI saw {company} {recent event}. Usually that means {the work it creates}, which is the kind of thing I help {type of company} with.\n\nCurious: is that being handled in-house, or still being figured out? Either way, happy to share {small useful thing} if it's helpful.",
  placeholders: [
    { key: "{recent event}", fill: "Something from the last few weeks: 'opened a second location', 'is hiring two account executives', 'launched the new pricing page'. Check their company page and posts." },
    { key: "{the work it creates}", fill: "Your honest read of the knock-on work, in plain words: 'a lot of new sales material in a short time', 'local search setup for the new area'." },
    { key: "{type of company}", fill: "Your niche: 'growing B2B teams', 'multi-location clinics'." },
    { key: "{small useful thing}", fill: "Something genuinely helpful you already have: 'the checklist I use for new-location launches', 'a couple of examples from similar teams'. Not a calendar link." }
  ],
  whyItWorks: [
    "The delay and the short thank-you make it feel human rather than automated.",
    "Asking whether something is in-house or not is a real question with an easy answer, and either answer tells you whether there's a fit.",
    "Offering a small resource gives them a reason to reply even if they're not buying now.",
    "It stays inside the length most people will read on a phone screen."
  ],
  variations: [
    { label: "They posted something recently", text: "Thanks for connecting, {first name}. Your post about {topic} got me thinking, particularly {detail}. We've seen something similar with {type of company} I work with: {short insight}. Is that something your team is dealing with right now, or has it already been solved on your side?" },
    { label: "Shorter version", text: "Thanks for connecting, {first name}. Saw the news about {recent event} at {company}. Congrats. If {the work it creates} ends up on your plate, I'd be glad to share how other {type of company} have handled it. No pitch, just ideas." }
  ],
  filledExample: {
    context: "A freelance SEO consultant has just connected with the marketing lead at Ashby & Rowe Physio, a fictional clinic group that announced a third location.",
    text: "Thanks for connecting, Ben.\n\nI saw Ashby & Rowe Physio opened a third clinic in Dunmore. Usually that means getting the new location showing up in local search fast, which is the kind of thing I help multi-location clinics with.\n\nCurious: is that being handled in-house, or still being figured out? Either way, happy to share the checklist I use for new-location launches if it's helpful."
  },
  mistakes: [
    "Messaging within minutes of the acceptance. It makes it obvious the connection was only ever a funnel.",
    "Dropping a calendar booking link in the first message. It asks for a meeting before you've earned a reply.",
    "Pasting your full service list. One relevant line is enough; they can check your profile if they're curious.",
    "Sending voice notes or videos unprompted to someone you've never spoken to. Some people like them; many find them intrusive."
  ],
  followUp: "If there's no reply after about a week, try one light follow-up: share the resource you offered, with a single line of context. After that, stop messaging and switch to being visible instead, with occasional thoughtful comments on their posts. Repeated DMs to someone who hasn't replied tend to get you muted. If the company is a strong fit, an email to a published business address is a reasonable second channel; [FindMyClients](/) shows the public contact details it finds for each company. See the [LinkedIn outreach guide](/guides/linkedin-outreach-for-freelancers) for a full cadence.",
  related: {
    guides: ["linkedin-outreach-for-freelancers", "buying-signals", "follow-up-emails"],
    templates: ["linkedin-connection-request", "cold-email-hiring-signal", "follow-up-email"],
    professions: ["seo-consultants", "marketing-agencies", "copywriters"]
  }
};
