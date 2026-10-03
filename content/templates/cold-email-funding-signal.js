export default {
  slug: "cold-email-funding-signal",
  title: "Cold email template: reaching out after a company raises money",
  metaTitle: "Cold Email Template for Recently Funded Startups",
  description: "A cold email template for pitching a startup that just announced funding, tied to what they said they'll spend it on. With variations and a filled example.",
  channel: "Email",
  useCase: "Send this within a few weeks of a public funding announcement, when the company has said what it plans to do with the money and that plan needs work you can do.",
  intro: [
    "A funding round means a company has fresh budget and a board expecting progress. That makes recently funded startups good prospects, and also means their founders get flooded with 'congrats on the raise!' emails from every agency with an alert set up. Congratulations alone don't earn a reply.",
    "What does: reading the announcement properly. Most funding posts say what the money is for, such as 'expanding into Germany', 'hiring our first sales team', or 'launching the self-serve plan'. Each of those creates specific work. This template connects your service to one stated plan, then offers to take a piece of it off their plate while they hire. The [buying signals guide](/guides/buying-signals) explains how to find these announcements early, and [FindMyClients](/) surfaces recent raises in its search results."
  ],
  template: "Subject: {stated plan} after the {round} round\n\nHi {first name},\n\nSaw the news about {company}'s {round} round. In the announcement you mentioned {stated plan}, which usually means {the work it creates} needs to happen fast, often before the new team is in place.\n\nThat's the part I help with. I'm a {your role} working with {type of company}, and I recently {one relevant result}.\n\nIf {stated plan} is on the roadmap for the next quarter, I'd be glad to share how I'd approach {specific piece of work} for {company}. Would a short call next week work?\n\n{your name}",
  placeholders: [
    { key: "{first name}", fill: "For seed and early rounds, the founder or CEO. For later rounds, the leader of the function your work touches: VP Marketing, Head of Product, Head of Growth." },
    { key: "{round}", fill: "Seed, Series A, and so on, as stated publicly. Don't mention the amount unless it adds something; it can read as 'I know you have money now'." },
    { key: "{stated plan}", fill: "Their own words, lightly paraphrased: 'expanding into the UK', 'launching a mobile app', 'doubling the sales team'. This must come from the announcement, a press piece, or a founder post." },
    { key: "{the work it creates}", fill: "Your honest read of the knock-on work: 'localized landing pages and a UK pricing page', 'sales collateral and case studies', 'onboarding flows'." },
    { key: "{specific piece of work}", fill: "One bounded project you'd propose: 'the UK launch landing page', 'the first three case studies'." }
  ],
  whyItWorks: [
    "It proves you read past the headline, which most outreach after a raise doesn't.",
    "It ties your service to a commitment the company has made publicly, so the need is not hypothetical.",
    "It acknowledges the real constraint after a raise: hiring takes months, but investors expect progress now.",
    "It proposes one piece of work, which is easier to approve than an open-ended 'partnership'."
  ],
  variations: [
    { label: "Shorter version", text: "Subject: help with {stated plan}\n\nHi {first name},\n\nCongrats on the {round}. You mentioned {stated plan}. I help {type of company} with exactly that, most recently {one relevant result}.\n\nIf it's useful, I'll send a one-page outline of how I'd handle {specific piece of work}. Want it?\n\n{your name}" },
    { label: "Later contact (2 to 3 months after the raise)", text: "Subject: {stated plan}, a few months in\n\nHi {first name},\n\nIt's been a couple of months since {company}'s {round}. If {stated plan} is underway, you're probably at the stage where the plan is clear but the hands to do it aren't all hired yet.\n\nI'm a {your role} who often fills that gap for {type of company}. Happy to help with {specific piece of work} if it's still open. Worth a chat?\n\n{your name}" }
  ],
  filledExample: {
    context: "A freelance B2B copywriter reads that Ledgerly, a fictional accounting software startup, raised a Series A to launch in the UK market.",
    text: "Subject: UK launch after the Series A round\n\nHi Javier,\n\nSaw the news about Ledgerly's Series A round. In the announcement you mentioned launching in the UK early next year, which usually means localized landing pages, UK pricing copy and a few customer stories need to happen fast, often before the new team is in place.\n\nThat's the part I help with. I'm a B2B copywriter working with finance software companies, and I recently wrote the launch site for an invoicing tool entering Ireland.\n\nIf the UK launch is on the roadmap for the next quarter, I'd be glad to share how I'd approach the launch landing page for Ledgerly. Would a short call next week work?\n\nHannah Brook"
  },
  mistakes: [
    "Opening with the dollar amount. It makes the email feel like you're following the money rather than the problem.",
    "Sending the same 'congrats on the raise' email to every funded company that week. Founders compare notes, and identical emails are easy to spot.",
    "Guessing their plans instead of reading the announcement. If they didn't say they're expanding, don't assume it.",
    "Waiting too long. After a few months the most urgent work has usually been assigned. Two to six weeks after the news is the sweet spot."
  ],
  followUp: "Founders are busy right after a raise, so silence often means 'not this week' rather than 'no'. Follow up once after about a week with something concrete: a short outline of how you'd approach the piece of work you mentioned, or a relevant example. If there's still no reply, wait a month and check whether they've posted a related job; if so, the [hiring-signal template](/templates/cold-email-hiring-signal) gives you a fresh, relevant reason to write again.",
  related: {
    guides: ["buying-signals", "cold-email-that-gets-replies", "lead-qualification"],
    templates: ["cold-email-hiring-signal", "linkedin-connection-request", "follow-up-email"],
    professions: ["marketing-agencies", "copywriters", "ux-designers"]
  }
};
