export default {
  slug: "chatgpt-prompts-for-cold-outreach",
  title: "ChatGPT Prompts for Cold Outreach: 18 Copyable Prompts",
  metaTitle: "18 ChatGPT Prompts for Cold Outreach (Copy and Paste)",
  description: "18 copyable ChatGPT prompts for cold outreach: prospect research, first drafts, subject lines, follow-ups and replies, with rules for checking every fact.",
  excerpt: "Prompts we actually use for research, drafting and follow-ups, written so the AI works from facts you give it instead of making things up.",
  category: "Cold outreach",
  published: "2026-10-03",
  updated: "2026-10-03",
  readingMinutes: 9,
  answer: "The best ChatGPT prompts for cold outreach give the model real source material, a clear role, a word limit and a format, then ask it to flag anything it is unsure about. Use prompts for research summaries, first drafts, subject lines and follow-ups, but verify every fact yourself, rewrite in your own voice and never paste private or client data.",
  keyTakeaways: [
    "Paste the source text (website, job post, news) into the prompt. Never ask the model to remember facts about a small company.",
    "Set hard limits: word count, reading level, one call to action, no buzzwords.",
    "Ask the model to quote its source and mark anything it guessed, so you can check it fast.",
    "Treat every output as a draft. Verify facts, cut length and make it sound like you.",
    "Keep personal data, client documents and confidential details out of public AI tools."
  ],
  sections: [
    {
      heading: "What makes a good cold outreach prompt?",
      blocks: [
        { type: "p", text: "A good outreach prompt gives the model facts, constraints and a format. Vague prompts like 'write a cold email to a dentist' produce vague, salesy emails because the model has nothing specific to work with." },
        { type: "p", text: "Every prompt below follows the same pattern:" },
        { type: "ul", items: [
          "**Context:** who you are and what you sell, in one or two sentences.",
          "**Source material:** text you pasted from a real, current page.",
          "**Constraints:** length, tone, banned phrases, one ask.",
          "**Output format:** bullets, a table or a ready-to-edit draft.",
          "**Honesty instruction:** quote the source, say 'not found' instead of guessing."
        ] },
        { type: "p", text: "Replace everything in {curly braces} before you run a prompt. The prompts work in ChatGPT and in most other chat assistants." }
      ]
    },
    {
      heading: "Before you use these prompts: three rules",
      blocks: [
        { type: "p", text: "Use these prompts only with information that is public or that you are allowed to share, and check every output before it reaches a prospect." },
        { type: "ol", items: [
          "**Verify facts.** Chat models can invent names, dates, funding rounds and email addresses. If a detail ends up in your message, confirm it on a live page first.",
          "**Never paste private data.** No client contracts, invoices, customer lists, personal phone numbers or anything under an NDA. Describe the situation in general terms instead.",
          "**Rewrite before sending.** AI drafts tend to sound alike. Cut them down and add one line only you could write."
        ] },
        { type: "tip", text: "Save your best prompts in a note with your own 'context' paragraph already filled in. You'll reuse them dozens of times." }
      ]
    },
    {
      heading: "Which prompts help with prospect research?",
      blocks: [
        { type: "p", text: "Research prompts turn a pasted web page into a short brief you can scan in under a minute. They are the most useful prompts on this list because research is the slowest part of outreach." },
        { type: "example", label: "Prompt 1: Company summary from website text", text: "You are helping me research a potential client. I sell {your service} to {type of client}.\n\nBelow is text copied from their website. Summarize in bullets:\n- What they sell and to whom\n- Their location(s)\n- Any sign of recent change (new product, new location, hiring, rebrand)\n- One specific detail I could mention in a first message\n\nQuote the sentence each bullet is based on. If something isn't in the text, write 'not found'. Do not use outside knowledge.\n\nWebsite text:\n{paste text}" },
        { type: "example", label: "Prompt 2: Find the buying signal in a job post", text: "I'm a freelance {your role}. Here is a job post from {company}.\n\nTell me:\n1. What problem they are trying to solve with this hire\n2. Which parts of the role a contractor could cover in the short term\n3. Any deadlines, launches or tools mentioned\n4. One question I could ask them that shows I read the post\n\nOnly use the text below.\n\nJob post:\n{paste text}" },
        { type: "example", label: "Prompt 3: Fit check against my ideal client", text: "My ideal client is: {industry, size, location, budget signals, trigger event}.\n\nHere are notes on a company:\n{paste notes}\n\nScore fit from 1 to 5 and explain in three bullets. List anything that would make this a poor fit. If the notes are missing information you need, list the questions I should answer before deciding." },
        { type: "example", label: "Prompt 4: Spot a visible gap", text: "Here is the text and a list of pages from {company}'s website:\n{paste text and page list}\n\nI offer {your service}. List up to three gaps a {your role} could fix (for example missing booking, no case studies, outdated blog). For each, say what in the text suggests it. Don't assume anything not shown." },
        { type: "p", text: "For a full research workflow and what AI gets wrong, see [AI for finding clients](/blog/ai-for-finding-clients). For what counts as a strong signal, see the [buying signals guide](/guides/buying-signals)." }
      ]
    },
    {
      heading: "Which prompts write a good first cold email?",
      blocks: [
        { type: "p", text: "Drafting prompts work best when you hand over the verified hook and a tight word limit. The model's job is structure; the substance comes from you." },
        { type: "example", label: "Prompt 5: First draft from verified notes", text: "Write a cold email from me, {your name}, a {your role}, to {recipient role} at {company}.\n\nVerified facts to use:\n- {signal, e.g. they're hiring a part-time designer}\n- {one specific observation}\n- {relevant past result, stated honestly}\n\nRules:\n- Under 110 words\n- Plain language, no buzzwords, no flattery\n- First line mentions the signal\n- One clear, low-effort ask (a yes/no question)\n- No claims beyond the facts above" },
        { type: "example", label: "Prompt 6: Three openers to choose from", text: "Using this verified fact about {company}: {fact}\n\nWrite three different opening lines for a cold email, each under 25 words. One direct, one curious, one that leads with a question. Don't start with 'I hope this finds you well' or 'I came across'." },
        { type: "example", label: "Prompt 7: Make it shorter", text: "Cut this email to under 80 words without losing the specific detail or the ask. Remove any sentence that talks about me rather than them.\n\n{paste draft}" },
        { type: "example", label: "Prompt 8: Remove salesy language", text: "Rewrite this email so it sounds like a busy professional wrote it to a peer. Remove hype words, exclamation marks and vague promises. Keep it under {N} words. Then list every phrase you changed.\n\n{paste draft}" },
        { type: "example", label: "Prompt 9: LinkedIn version", text: "Turn this cold email into a LinkedIn connection note under 280 characters and a follow-up message under 70 words to send after they accept. Keep the same specific detail.\n\n{paste email}" },
        { type: "p", text: "Check the result against the structure in [cold emails that get replies](/guides/cold-email-that-gets-replies), or paste it into the free [cold email checker](/tools/cold-email-checker)." }
      ]
    },
    {
      heading: "What prompts work for subject lines?",
      blocks: [
        { type: "p", text: "Subject line prompts should ask for many short options so you can pick, not one 'perfect' line. Short, specific and lower-case subject lines usually read like a real email rather than a campaign." },
        { type: "example", label: "Prompt 10: Subject line options", text: "Write 10 subject lines for this cold email. Rules: under 6 words, no clickbait, no emojis, no 'quick question', at least half should reference {company} or {the signal}.\n\n{paste email}" },
        { type: "example", label: "Prompt 11: Subject line review", text: "Here are my subject line options:\n{paste list}\n\nFor each, say whether it sounds like a personal email or a marketing blast, and why. Recommend the best two." },
        { type: "p", text: "There are 30 more examples organized by situation in [cold email subject lines](/blog/cold-email-subject-lines)." }
      ]
    },
    {
      heading: "Which prompts help with follow-ups?",
      blocks: [
        { type: "p", text: "Follow-up prompts should add something new each time, not just 'bumping this up'. Give the model a fresh angle and it will write a useful nudge." },
        { type: "example", label: "Prompt 12: First follow-up with new value", text: "I sent this email {N} days ago with no reply:\n{paste email}\n\nWrite a follow-up under 60 words that adds one new, useful thing: {e.g. a relevant idea, a short example, a link to a similar project}. Don't guilt-trip or apologize for following up." },
        { type: "example", label: "Prompt 13: Breakup email", text: "Write a final, polite follow-up under 50 words for a prospect who hasn't replied to two emails. Make it easy for them to say 'not now' or point me to the right person. No passive-aggressive tone." },
        { type: "example", label: "Prompt 14: Follow-up sequence plan", text: "I'm reaching out to {type of client} about {offer}. Plan a sequence of 3 follow-ups after the first email. For each, give the day to send, the angle, and a one-sentence summary. Each one must add something different." },
        { type: "p", text: "Timing and how many to send are covered in the [follow-up emails guide](/guides/follow-up-emails)." }
      ]
    },
    {
      heading: "What prompts help when a prospect replies?",
      blocks: [
        { type: "p", text: "Reply prompts help you answer quickly without sounding defensive. Paste only the prospect's message and remove their name and contact details first." },
        { type: "example", label: "Prompt 15: Reply to 'send me more info'", text: "A prospect replied: '{paste reply, names removed}'.\n\nWrite a short reply (under 90 words) that gives them two relevant points about {your service}, one short example, and suggests a 15-minute call with two time options. No attachments, no long pitch." },
        { type: "example", label: "Prompt 16: Handle a price objection", text: "A prospect said my quote of {amount} for {project} is too high. Give me three reply options: one that explains value, one that offers a smaller first phase, and one that politely holds the price. Each under 80 words." },
        { type: "example", label: "Prompt 17: Discovery call prep", text: "I have a call with a {type of business} that wants {project}. Here's what I know: {notes, no personal data}.\n\nList 8 questions to ask, in order, to understand goals, budget, timeline and who decides. Mark the two most important." },
        { type: "example", label: "Prompt 18: Review my whole message", text: "Act as a busy {recipient role} who gets 30 cold emails a week. Read this email and tell me honestly: would you reply? What's the first thing that makes you want to delete it? What would you change?\n\n{paste email}" },
        { type: "p", text: "More on objections in [how to handle price objections](/blog/handle-price-objections), and a full call structure in [discovery call questions](/blog/discovery-call-questions)." }
      ]
    },
    {
      heading: "What should you never ask ChatGPT to do in outreach?",
      blocks: [
        { type: "p", text: "Don't ask a chat model for facts it can't know or for tasks that cross legal or ethical lines. These prompts produce output that looks useful and causes problems." },
        { type: "ul", items: [
          "**'Find me the email of the CEO of {small company}.'** You'll often get an invented address. Use public pages instead, as described in [finding business contact details](/guides/find-business-contact-details).",
          "**'What's {company}'s revenue / funding / headcount?'** Answers from memory may be years out of date or simply wrong.",
          "**'Write 500 personalized emails from this list.'** Mass output with no checking multiplies errors and can harm your sending reputation.",
          "**'Make it sound like I know them.'** Faking a relationship is dishonest and easy to spot.",
          "**Anything involving pasted personal data** such as private phone numbers or customer lists."
        ] },
        { type: "p", text: "If you want AI help finding companies with real, current signals, use a tool that searches the live web and shows where each lead came from. [FindMyClients](/) does this and drafts a first message you can then refine with the prompts above." }
      ]
    }
  ],
  howTo: null,
  faqs: [
    { q: "What is the best ChatGPT prompt for a cold email?", a: "The best prompt gives the model your role, the recipient's role, one or two verified facts about the company, a word limit around 100 words and a single clear ask. It should also forbid buzzwords and claims beyond the facts you provided. The more specific your input, the less generic the email." },
    { q: "Can ChatGPT write personalized cold emails?", a: "It can write the structure of a personalized email, but the personalization has to come from you. If you paste a real detail from the prospect's website or a job post, the model can build a good opener around it. If you ask it to personalize from memory, it may invent details." },
    { q: "Should I tell prospects I used AI to write my email?", a: "There is generally no requirement to disclose that a tool helped draft a business email, but you are responsible for every word. If the email is accurate, relevant and sounds like you, how it was drafted matters little. If it contains invented details, using AI is no excuse." },
    { q: "Is it safe to paste prospect information into ChatGPT?", a: "Public business information, like text from a company's website or a public job post, is usually fine to paste. Avoid personal data such as private phone numbers, home addresses or customer lists, and anything covered by a client confidentiality agreement. Check your AI tool's data settings and remove names when you can." },
    { q: "How do I stop ChatGPT emails sounding robotic?", a: "Set a strict word limit, ban common filler phrases, and ask for plain language written to a peer. Then edit: remove flattery, cut the first sentence if it's about you, and add one line only you could write, such as a similar project you did. Reading the email aloud quickly exposes robotic phrasing." }
  ],
  sources: [],
  related: {
    guides: ["cold-email-that-gets-replies", "follow-up-emails", "find-business-contact-details"],
    blog: ["ai-for-finding-clients", "cold-email-subject-lines", "handle-price-objections"],
    templates: ["follow-up-email", "breakup-email", "linkedin-connection-request"],
    professions: ["copywriters", "ai-automation-consultants"],
    glossary: ["cold-email", "follow-up-cadence", "reply-rate"]
  }
};
