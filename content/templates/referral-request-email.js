export default {
  slug: "referral-request-email",
  title: "Referral request email template for freelancers",
  metaTitle: "Referral Request Email Template for Freelancers",
  description: "A referral request email template for asking happy clients to introduce you, with a ready-to-forward blurb that takes them two minutes. With an example.",
  channel: "Email",
  useCase: "Send this to a past or current client who was happy with your work, ideally a few weeks after a successful project delivered a visible result.",
  intro: [
    "Referrals are the warmest leads a freelancer gets. Someone the prospect already trusts vouches for you, and the usual questions about whether you're reliable are answered before you speak. Yet most freelancers never ask, or ask so vaguely ('let me know if you know anyone!') that nothing happens. Happy clients generally want to help; they just don't know who to think of or what to say.",
    "This template fixes both problems. It describes exactly the kind of person you'd like to meet, so a name comes to mind, and it includes a short blurb they can forward as is, so the introduction takes two minutes. Timing matters: ask when the results are fresh and the client has said something positive, not at the moment you send the final invoice."
  ],
  template: "Subject: a small favor, {first name}\n\nHi {first name},\n\nIt's been great seeing {result of the project} since we wrapped up {project}.\n\nI'm taking on a couple of new clients in {month}, and I'd love to work with more businesses like yours. Specifically, {description of ideal referral}.\n\nIf anyone comes to mind, here's a two-line intro you can forward or adapt:\n\n'{forwardable blurb}'\n\nNo pressure at all. And thank you again for {something specific about working together}.\n\n{your name}",
  placeholders: [
    { key: "{result of the project}", fill: "A concrete outcome they've seen or mentioned: 'the new booking page bringing in weekend appointments', 'the launch emails going out on time'. Don't invent numbers." },
    { key: "{description of ideal referral}", fill: "Narrow enough to trigger a name: 'other clinic owners who are opening a second location', 'founders about to launch a product who don't have a marketing hire yet'." },
    { key: "{forwardable blurb}", fill: "Two sentences in their voice, about you: 'I worked with {your name} on our website and it was painless. They're great if you need X.' Keep it short so they can tweak it." },
    { key: "{something specific about working together}", fill: "A real detail: 'getting all that feedback to me so quickly', 'trusting me with the rebrand'." }
  ],
  whyItWorks: [
    "Opening with their result reminds them why they were happy before you ask for anything.",
    "A precise description of who you want makes it easy for a specific name to come to mind.",
    "The ready-made blurb removes the effort of writing an introduction, which is where most referrals stall.",
    "'Taking on a couple of new clients' gives a reason for asking now without sounding desperate."
  ],
  variations: [
    { label: "Shorter version", text: "Subject: quick question\n\nHi {first name},\n\nGlad {result of the project} is working out. Do you know any other {type of business} who might need help with {your service}? If so, I'd be grateful for an intro; happy to send a short blurb you can forward.\n\n{your name}" },
    { label: "Ask for a specific person", text: "Subject: intro to {contact name}?\n\nHi {first name},\n\nI noticed you're connected with {contact name} at {their company}, who seem to be {relevant observation}. Would you feel comfortable introducing us? Totally fine if not; I know intros spend your goodwill.\n\n{your name}" }
  ],
  filledExample: {
    context: "A freelance bookkeeper asks Marlow Street Bakery, a fictional client, for referrals two months after cleaning up its books ahead of tax season.",
    text: "Subject: a small favor, Elena\n\nHi Elena,\n\nIt's been great seeing your accountant sign off the year-end with no back-and-forth since we wrapped up the bookkeeping cleanup.\n\nI'm taking on a couple of new clients in November, and I'd love to work with more businesses like yours. Specifically, other food businesses with one or two locations whose books have fallen a few months behind.\n\nIf anyone comes to mind, here's a two-line intro you can forward or adapt:\n\n'Our books were a mess until Kofi sorted them out in a few weeks. If you're behind on bookkeeping, he's worth a call.'\n\nNo pressure at all. And thank you again for getting me all those receipts so quickly.\n\nKofi Mensah"
  },
  mistakes: [
    "Asking vaguely ('let me know if you know anyone'). Without a clear picture, nobody comes to mind.",
    "Asking clients whose project went badly or is still unresolved. Fix the relationship first.",
    "Offering cash for referrals without thinking it through. Some clients find it awkward, and in some industries it creates disclosure issues. A sincere thank-you or a small gift after a successful intro is usually safer.",
    "Not following up with the referrer. Tell them how it went, whether or not the introduction turned into work."
  ],
  followUp: "If the client doesn't reply, let it go for a few weeks; referral requests are favors, so chasing hard is out of place. A natural second chance comes when you next talk anyway, such as a check-in, an invoice or a small extra task. If they do introduce someone, thank them the same day, reply to the introduction within hours, and send the referrer a brief update later. For the new contact, adapt your usual first email but lead with the shared connection. You can also run a search in [FindMyClients](/) for companies similar to your best client and approach them directly.",
  related: {
    guides: ["how-to-find-clients-as-a-freelancer", "ideal-client-profile", "lead-qualification"],
    templates: ["breakup-email", "linkedin-connection-request", "follow-up-email"],
    professions: ["bookkeepers", "web-developers", "graphic-designers"]
  }
};
