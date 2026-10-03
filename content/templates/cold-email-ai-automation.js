export default {
  slug: "cold-email-ai-automation",
  title: "Cold email template: AI and automation pitch",
  metaTitle: "AI Automation Cold Email Template for Consultants",
  description: "A cold email template for automation consultants that names one manual, repetitive task the prospect visibly does today. With variations and a filled example.",
  channel: "Email",
  useCase: "Send this when you can see a business doing a repetitive task by hand, such as re-typing web form inquiries, sending quotes manually, or hiring for a data-entry or admin role.",
  intro: [
    "AI is the most over-pitched service right now. Business owners receive daily emails about 'transforming operations with AI', and most of them say nothing about the business they're sent to. The way to stand out is to be boringly specific: name one task, estimate the time it eats, and describe the fix in a sentence a non-technical owner can picture.",
    "You can often spot these tasks from outside. A job ad for an 'admin assistant to process inquiries and update the CRM' is practically a spec. A contact form that promises 'we'll email you a quote within 48 hours' usually means someone is building those quotes by hand. Pick one, and keep the language plain; 'AI' can appear once, or not at all. In [FindMyClients](/), searching for companies hiring admin or operations roles is a quick way to surface these."
  ],
  template: "Subject: {manual task} at {company}\n\nHi {first name},\n\nI noticed {where you saw it}, which suggests someone at {company} is {manual task} by hand. In businesses your size that's often {rough time} a week of copy-paste work.\n\nI set up automations for {type of business}. For this, a typical setup would {plain description of the fix}, and your team would just check and approve.\n\nIt's usually a one- or two-week project using tools you may already pay for. Want me to map out how it would work for {company}, in one page?\n\n{your name}",
  placeholders: [
    { key: "{manual task}", fill: "The repetitive job in plain words: 'copying web inquiries into your CRM', 'writing each quote from scratch', 'chasing unpaid invoices'." },
    { key: "{where you saw it}", fill: "The evidence: 'your job post for an operations assistant mentions updating spreadsheets from email', 'your quote form says a team member will reply within two days'." },
    { key: "{rough time}", fill: "A cautious rule-of-thumb estimate like 'a few hours'. Frame it as a guess; you don't know their volume." },
    { key: "{plain description of the fix}", fill: "One sentence, no jargon: 'read each new inquiry, pull out the details, and create a draft quote in your existing system'." },
    { key: "{type of business}", fill: "A niche where you've done this before: 'property management firms', 'logistics brokers', 'accounting practices'." }
  ],
  whyItWorks: [
    "It's anchored in visible evidence, so it reads as an observation rather than a hype pitch.",
    "Keeping a human in the loop ('your team would just check and approve') addresses the most common fear about automation: errors going out unchecked.",
    "A one- or two-week scope with existing tools makes it sound affordable and low-risk.",
    "It barely mentions AI, which ironically makes it more credible than pitches built around the buzzword."
  ],
  variations: [
    { label: "Hiring-signal angle", text: "Subject: your {role title} opening\n\nHi {first name},\n\nYour {role title} post lists {repetitive duties}. A good share of that can usually be automated, which would let the person you hire focus on {higher-value part of the role}, or make a part-time hire enough.\n\nI build these setups for {type of business}. Happy to show you how in a 15-minute call.\n\n{your name}" },
    { label: "Shorter version", text: "Subject: {manual task}\n\nHi {first name},\n\nIt looks like {company} handles {manual task} by hand. I automate exactly that for {type of business}, with a human approving anything before it goes out.\n\nWant a one-page outline of how it would work for you?\n\n{your name}" }
  ],
  filledExample: {
    context: "An automation consultant sees that Kestrel Property Management, a fictional rental property firm, promises a maintenance-request response within 48 hours and is hiring an admin to log requests.",
    text: "Subject: logging maintenance requests at Kestrel Property Management\n\nHi Olivia,\n\nI noticed your job post for an office administrator mentions logging tenant maintenance requests from email into your property system, which suggests someone at Kestrel Property Management is doing that by hand. In businesses your size that's often several hours a week of copy-paste work.\n\nI set up automations for property management firms. For this, a typical setup would read each request, pull out the property, issue and urgency, and create a draft ticket in your existing system, and your team would just check and approve.\n\nIt's usually a one- or two-week project using tools you may already pay for. Want me to map out how it would work for Kestrel, in one page?\n\nChris Adeyemi"
  },
  mistakes: [
    "Leading with the technology ('GPT-powered agents', 'LLM workflows'). Owners buy hours saved and fewer mistakes, not model names.",
    "Promising to replace staff. It alarms the very people who will read and forward your email.",
    "Ignoring data sensitivity. If the task involves client or patient data, mention briefly how you'd handle it, or expect a quick no.",
    "Inventing ROI numbers. A cautious estimate framed as a guess is more believable than '87% time savings'."
  ],
  followUp: "Follow up after five to seven working days with a tiny piece of the map you offered: three steps showing how the request would flow, in plain words. Owners often need to picture it before they reply. If the evidence changes, for example the job post comes down, adjust; the [hiring-signal template](/templates/cold-email-hiring-signal) and [follow-up guide](/guides/follow-up-emails) cover both situations.",
  related: {
    guides: ["buying-signals", "job-posts-as-leads", "follow-up-emails"],
    templates: ["cold-email-hiring-signal", "follow-up-email", "linkedin-message-after-connecting"],
    professions: ["ai-automation-consultants", "bookkeepers"]
  }
};
