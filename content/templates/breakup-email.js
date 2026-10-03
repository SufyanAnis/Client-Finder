export default {
  slug: "breakup-email",
  title: "Breakup email template: the polite last follow-up",
  metaTitle: "Breakup Email Template: The Final Sales Follow-Up",
  description: "A breakup email template for freelancers to end a cold outreach sequence politely and leave the door open. Includes variations and a filled example.",
  channel: "Email",
  useCase: "Send this as the last message in a cold outreach sequence, after two or three unanswered emails, to close the loop gracefully.",
  intro: [
    "The breakup email is the last message you send to a prospect who hasn't replied. It sounds like giving up, but it's often the message that finally gets a reply. People who meant to answer feel a nudge to finally do so, and people who aren't interested get an easy way to say so, which is useful too; a clear no lets you stop spending time on the lead.",
    "There's a version of this email that's manipulative ('I'll assume you're not interested in growing your business'), and you should never send it. The goal is the opposite: be gracious, take the pressure off completely, and leave a door they can walk through later. Months from now, when their situation changes, the freelancer who bowed out politely is the one they remember."
  ],
  template: "Subject: Re: {original subject}\n\nHi {first name},\n\nI've sent a couple of notes about {topic} and haven't heard back, so I'll assume it isn't a priority right now. That's completely fine, and I'll stop emailing about it.\n\nIf things change later in the year, {small standing offer}. You can reach me at this address any time, and there's no need to explain the gap.\n\nThanks for reading, and good luck with {something specific to them}.\n\n{your name}",
  placeholders: [
    { key: "{original subject}", fill: "Reply in the same thread so the whole history sits underneath." },
    { key: "{topic}", fill: "What you pitched, in a few words: 'the booking page changes', 'help with the UK launch'." },
    { key: "{small standing offer}", fill: "Something concrete they can come back for: 'the offer of a free screen recording stands', 'I'm happy to look over a draft'." },
    { key: "{something specific to them}", fill: "A genuine, specific send-off: 'the new clinic opening', 'the spring collection launch'. Skip it if you can't make it real." }
  ],
  whyItWorks: [
    "Saying you'll stop removes all pressure, which paradoxically makes replying easier.",
    "'Completely fine' makes no-reply a respectable choice rather than something to feel awkward about.",
    "The standing offer keeps the door open without demanding anything now.",
    "A specific, warm send-off leaves a good last impression, which matters when they're hiring months later."
  ],
  variations: [
    { label: "Ask for a referral instead", text: "Subject: Re: {original subject}\n\nHi {first name},\n\nI'll stop emailing about {topic}; it's clearly not the right time. One small ask before I go: if you know another {type of business} owner who's been struggling with {problem}, I'd be grateful for an introduction.\n\nEither way, thanks, and best of luck.\n\n{your name}" },
    { label: "Check back later", text: "Subject: Re: {original subject}\n\nHi {first name},\n\nI'll leave this here for now. Would it be all right if I checked in once in {month}, in case {topic} is back on the table? If not, just say so and I won't.\n\n{your name}" }
  ],
  filledExample: {
    context: "A freelance copywriter has sent three emails over three weeks to Copperleaf Tailoring about its homepage copy and heard nothing.",
    text: "Subject: Re: a different headline for Copperleaf Tailoring\n\nHi Grace,\n\nI've sent a couple of notes about the homepage rewrite and haven't heard back, so I'll assume it isn't a priority right now. That's completely fine, and I'll stop emailing about it.\n\nIf things change later in the year, the offer of a free homepage draft stands. You can reach me at this address any time, and there's no need to explain the gap.\n\nThanks for reading, and good luck with the new wedding-season fittings.\n\nOwen Mercer"
  },
  mistakes: [
    "Sending a guilt-trip ('I guess you don't care about losing customers'). It burns the bridge and can get shared for the wrong reasons.",
    "Calling it a 'final notice' or using fake urgency. You're a freelancer, not a debt collector.",
    "Saying you'll stop, then emailing again next week. If you promise to stop, stop.",
    "Sending a breakup after only one email. Give the sequence a fair chance first: two or three thoughtful touches."
  ],
  followUp: "After a breakup email, don't follow up again on the same pitch. Mark the lead as closed in your tracker with a note on why, and set a reminder for six months or so if they were a strong fit. If something new happens at the company later, like a funding round, a relevant hire or a relaunch, that's a fresh reason to write, and a new email about the new event is fine. The [hiring-signal template](/templates/cold-email-hiring-signal) is a good restart. [FindMyClients](/) keeps your pipeline in one place so closed leads don't get emailed twice by mistake.",
  related: {
    guides: ["follow-up-emails", "track-leads-in-a-spreadsheet", "lead-qualification"],
    templates: ["follow-up-email", "referral-request-email", "cold-email-hiring-signal"],
    professions: ["copywriters", "graphic-designers", "web-developers"]
  }
};
