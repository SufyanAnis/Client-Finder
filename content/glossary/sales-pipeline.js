export default {
  slug: "sales-pipeline",
  term: "Sales pipeline",
  metaTitle: "What is a sales pipeline? Stages for freelancers",
  description: "A sales pipeline tracks every potential client from first contact to signed project in clear stages. Simple stages and a weekly routine for freelancers.",
  short: "A sales pipeline is a visual or tabular record of every potential deal, organized into stages from first contact to signed work, showing what needs to happen next.",
  blocks: [
    { type: "p", text: "Freelancers often treat sales as a list of emails in an inbox. A pipeline turns that into a system: every lead sits in one stage, with a next action and a date. You can see at a glance how many conversations are live, which ones are stuck, and whether you have enough work coming to cover next month." },
    { type: "p", text: "A pipeline for a solo business or small agency can be very simple:" },
    { type: "table", caption: "Example pipeline stages", head: ["Stage", "Meaning", "Next action"], rows: [
      ["Researched", "Fits your ICP, contact found", "Send first message"],
      ["Contacted", "First message sent", "Follow up on schedule"],
      ["Replied", "Any response", "Book a call or answer"],
      ["Call booked", "Discovery call scheduled", "Prepare questions"],
      ["Proposal sent", "Scope and price sent", "Follow up in 3 to 5 days"],
      ["Won / Lost", "Decision made", "Kick off, or note why lost"]
    ] },
    { type: "p", text: "The value is in the habits around it. Once a week, look at every lead with a past-due next action and do it, or close it. Count how many leads moved stage. If proposals are piling up but nothing closes, the problem is pricing or qualification. If nobody replies, it is targeting or messaging." },
    { type: "p", text: "You do not need software to start. A spreadsheet with columns for company, contact, signal, stage, last contact, next action and notes works fine, and you can move into a [CRM](/glossary/crm) later. The [spreadsheet pipeline guide](/guides/track-leads-in-a-spreadsheet) has a ready layout." },
    { type: "p", text: "Pitfalls: too many stages, leads with no next-action date, keeping dead leads forever so the pipeline looks healthier than it is, and only updating it when work is slow. A thin pipeline while you are busy is what causes the feast-or-famine cycle." },
    { type: "tip", text: "Keep outreach going at a low level even when booked. A few messages a week stops the pipeline from emptying when the current project ends." }
  ],
  example: "A fictional graphic designer's sheet shows 40 contacted, 6 replied, 3 calls, 2 proposals, 1 won this month. She sees her bottleneck is replies, not closing, and changes her targeting.",
  related: {
    glossary: ["crm", "lead-qualification", "warm-lead", "follow-up-cadence"],
    guides: ["track-leads-in-a-spreadsheet", "lead-qualification"],
    blog: ["follow-up-after-proposal", "lead-generation-for-agencies"],
    templates: ["follow-up-email"]
  }
};
