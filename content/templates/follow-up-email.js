export default {
  slug: "follow-up-email",
  title: "Follow-up email template for when a prospect doesn't reply",
  metaTitle: "Follow-Up Email Template After No Response",
  description: "A follow-up email template for freelancers that adds something new instead of 'just checking in'. When to send it, variations for each touch, and an example.",
  channel: "Email",
  useCase: "Send this four to seven working days after a cold email that got no reply, as a reply in the same thread.",
  intro: [
    "Silence after a first email rarely means no. Usually it means the person was busy, saw it on their phone, meant to come back to it and didn't. A follow-up gives them a second chance, and a good share of replies to cold outreach tend to come from follow-ups rather than the first email. What kills follow-ups is the content: 'just checking in', 'bumping this to the top of your inbox', 'did you get a chance to look?' All of these ask for attention while offering nothing new.",
    "The rule this template follows is simple: every follow-up must add something. A fresh observation, a small piece of the work you offered, a short example, or a simpler question. Send it as a reply in the original thread so they have the context, keep it shorter than the first email, and make it easy to answer with one word. The [follow-up emails guide](/guides/follow-up-emails) covers how many to send and how far apart."
  ],
  template: "Subject: Re: {original subject}\n\nHi {first name},\n\nOne more thought on {topic of first email}. {new piece of value}.\n\nI'm mentioning it because it costs nothing to try, and you'd see fairly quickly whether it makes a difference before spending anything with me or anyone else.\n\nIf {original offer} would still be useful, just reply 'yes' and I'll send it over. If the timing's wrong, no problem at all.\n\n{your name}",
  placeholders: [
    { key: "{original subject}", fill: "Keep the original subject so it threads. Most email apps do this automatically if you hit reply." },
    { key: "{topic of first email}", fill: "A short reminder: 'your booking page', 'the UK launch', 'the webinar clips'." },
    { key: "{new piece of value}", fill: "The heart of the email. One or two sentences: a second problem you noticed, a quick fix they can do themselves, a relevant before-and-after, or a free sample of the work you offered." },
    { key: "{original offer}", fill: "Restate the small thing you offered the first time: 'the screen recording', 'the one-page plan'." }
  ],
  whyItWorks: [
    "It gives them a new reason to engage instead of repeating the old one more loudly.",
    "Asking for a one-word 'yes' is the lowest-friction reply possible, which matters for someone reading on a phone.",
    "'If the timing's wrong, no problem' signals you're not going to pester them, which makes replying feel safer.",
    "Threading keeps context, so they don't have to search for your first email."
  ],
  variations: [
    { label: "Second follow-up (value first)", text: "Subject: Re: {original subject}\n\nHi {first name},\n\nI went ahead and made {free sample} anyway, since I'd already started. It's here: {link}.\n\nNo strings. If you'd like more like it, let me know.\n\n{your name}" },
    { label: "Simpler question", text: "Subject: Re: {original subject}\n\nHi {first name},\n\nQuick one, so I don't keep filling your inbox: is {topic of first email} something you're looking at this quarter, or should I check back later in the year?\n\n{your name}" },
    { label: "Wrong person check", text: "Subject: Re: {original subject}\n\nHi {first name},\n\nI may have reached the wrong person. Is there someone at {company} who looks after {topic of first email}? A name is plenty; I'll take it from there.\n\n{your name}" }
  ],
  filledExample: {
    context: "A freelance web designer emailed Northgate Dental about its hidden mobile booking button five days ago and heard nothing back.",
    text: "Subject: Re: Northgate Dental's booking button on mobile\n\nHi Priya,\n\nOne more thought on your booking page. Even before any redesign, moving the Book Online button above the welcome text would probably help, and your current site builder lets you do that in a few minutes.\n\nI'm mentioning it because it costs nothing to try, and you'd see fairly quickly whether it makes a difference before spending anything with me or anyone else.\n\nIf the screen recording would still be useful, just reply 'yes' and I'll send it over. If the timing's wrong, no problem at all.\n\nSam Okafor"
  },
  mistakes: [
    "Writing 'just following up' or 'bumping this' with nothing new. It reads as impatience rather than value.",
    "Guilt-tripping ('I haven't heard back from you...'). They owe you nothing, and the tone ends conversations.",
    "Starting a new thread with a new subject, so they lose the context of your first email.",
    "Following up too fast or too often. Several follow-ups within a week will get you marked as spam."
  ],
  followUp: "A sensible sequence for most freelancers is the first email, this follow-up around day five, a second follow-up with a free sample or simpler question a week or so later, and finally a short [breakup email](/templates/breakup-email). Three or four touches in total is plenty. Log each touch with dates so you know where every lead stands; a pipeline like the one in [FindMyClients](/), or the setup in the [spreadsheet tracking guide](/guides/track-leads-in-a-spreadsheet), stops leads slipping through the cracks.",
  related: {
    guides: ["follow-up-emails", "track-leads-in-a-spreadsheet", "cold-email-that-gets-replies"],
    templates: ["breakup-email", "cold-email-website-redesign", "cold-email-seo-audit"],
    professions: ["web-designers", "copywriters", "bookkeepers"]
  }
};
