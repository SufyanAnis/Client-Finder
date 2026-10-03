export default {
  slug: "track-leads-in-a-spreadsheet",
  title: "How to track leads in a spreadsheet: a simple freelancer CRM",
  metaTitle: "Track Leads in a Spreadsheet: Simple CRM for Freelancers",
  description: "Build a simple lead tracker in Excel or Google Sheets: the columns to use, pipeline stages, formulas for follow-up dates, and a 20-minute weekly routine.",
  excerpt: "You do not need a CRM to run a tidy outreach pipeline. A spreadsheet with the right columns, a few stages and a weekly routine will keep every lead moving.",
  category: "Strategy",
  updated: "2026-10-03",
  readingMinutes: 8,
  keyTakeaways: [
    "A spreadsheet is enough until you are handling well over a hundred active leads or working in a team.",
    "Use one row per company and about 12 to 15 columns; the most important are stage, next action and next action date.",
    "Keep stages few and clear: Researching, Contacted, Replied, Call booked, Proposal sent, Won, Lost, Not now.",
    "Sort by next action date every working day and review the whole sheet once a week.",
    "Record sources and opt-outs, and delete leads you have stopped pursuing."
  ],
  sections: [
    {
      heading: "Why a spreadsheet is often the right CRM",
      blocks: [
        { type: "p", text: "Dedicated CRMs are powerful, but for a solo freelancer or a two-person agency they often add more admin than they save. You end up maintaining fields you never use and paying for seats you do not need. A spreadsheet is free, flexible, works offline, and you already know how to use it." },
        { type: "p", text: "The point of a tracker is not data for its own sake. It answers three questions every morning:" },
        { type: "ol", items: [
          "Who do I need to contact today?",
          "Which conversations are close to turning into paid work?",
          "Where is my outreach leaking: are people not replying, or replying and then going quiet?"
        ] },
        { type: "p", text: "A well-built spreadsheet answers all three in seconds. You can move to a CRM later if you outgrow it, and your data will move with you." },
        { type: "tip", text: "Signs you have outgrown a spreadsheet: several people editing the same rows, more than about 150 active leads, or needing your email history attached to each contact automatically." }
      ]
    },
    {
      heading: "The columns to use",
      blocks: [
        { type: "p", text: "Use **one row per company**, not per person. Most freelance deals are with a company, and it stops you from accidentally pitching two people at the same firm on the same day. Here is a layout that covers what matters without bloat:" },
        { type: "ul", items: [
          "**Company** — the business name.",
          "**Website** — so you can check them quickly before each touch.",
          "**Country** — useful for time zones and for knowing which outreach rules apply.",
          "**Contact name and role** — the person who owns the problem, if known.",
          "**Contact route** — the email, LinkedIn page or phone number you are using.",
          "**Source** — where you found the contact detail and when (for example 'contact page, 3 Oct').",
          "**Signal** — the reason you are reaching out now: hiring, funding, launch, slow site.",
          "**Fit score** — 0 to 100, or simply High, Medium, Low.",
          "**Stage** — from a dropdown list (see the next section).",
          "**Last contact date** — when you last sent something.",
          "**Touches** — how many messages you have sent so far.",
          "**Next action** — the specific next step, like 'Follow-up 2: send teardown'.",
          "**Next action date** — when that step is due.",
          "**Deal value** — your estimate of the first project's size.",
          "**Notes / outcome** — short notes, and the reason if lost."
        ] },
        { type: "p", text: "Freeze the top row and the Company column so they stay visible as you scroll. Use data validation dropdowns for Stage and Fit so values stay consistent and filter cleanly." }
      ]
    },
    {
      heading: "What a good row looks like",
      blocks: [
        { type: "p", text: "Columns are easy to set up; the discipline is in how you fill them. Here is one realistic row for a fictional lead, written the way you would actually type it:" },
        { type: "example", label: "Example row", text: "Company: Northgate Dental\nWebsite: northgatedental.example\nCountry: UK (limited company)\nContact: Priya Shah, Practice Manager\nContact route: practice manager email on team page\nSource: team page, 3 Oct\nSignal: hiring web developer (6-month contract)\nFit score: 85\nStage: Contacted\nLast contact date: 6 Oct\nTouches: 1\nNext action: Follow-up 1, offer the three mobile fixes\nNext action date: 9 Oct\nDeal value: 3,000\nNotes: site slow on mobile, booking form errors" },
        { type: "p", text: "Notice the Next action is specific enough that future you can do it in two minutes without rereading anything. 'Follow up' alone is not a next action; 'Follow-up 1, offer the three mobile fixes' is. The Signal and Notes columns hold the personal detail that makes each message credible, so you never have to re-research a company before a follow-up." },
        { type: "tip", text: "If a row has no Next action date, it is invisible to your daily routine. Every lead outside Won, Lost and Do not contact should have one." }
      ]
    },
    {
      heading: "Pipeline stages that stay simple",
      blocks: [
        { type: "p", text: "Too many stages and you will spend time debating which one a lead belongs in. Too few and you cannot see where deals stall. These eight work for most freelancers:" },
        { type: "ol", items: [
          "**Researching** — found the company, checking fit and finding the right contact.",
          "**Contacted** — first message sent, follow-ups in progress.",
          "**Replied** — any positive or neutral reply.",
          "**Call booked** — a conversation is scheduled.",
          "**Proposal sent** — they have a price and scope.",
          "**Won** — signed or deposit paid.",
          "**Lost** — they said no, chose someone else, or went silent after a proposal.",
          "**Not now** — timing is wrong but the fit is good. Set a next action date a few months out."
        ] },
        { type: "p", text: "Add a ninth value, **Do not contact**, for anyone who asked you to stop. Never delete these rows; keep them so you do not re-add the company or person by mistake. Alternatively, keep them in a separate 'Suppression' tab and check it before every batch." }
      ]
    },
    {
      heading: "Useful formulas and formatting",
      blocks: [
        { type: "p", text: "A few small automations make the sheet much easier to use. These work in both Google Sheets and Excel, with minor differences." },
        { type: "ul", items: [
          "**Default next follow-up date.** If Last contact date is in column J, a formula like =WORKDAY(J2,3) gives a date three working days later. Use it as a suggestion and overwrite it when needed.",
          "**Highlight what is due.** Add conditional formatting to the Next action date column: red if the date is before today, yellow if it is today.",
          "**Days since last touch.** =TODAY()-J2 shows how long a lead has been waiting. Anything over 30 days in Contacted probably belongs in Lost or Not now.",
          "**Pipeline value.** =SUMIF(I:I,\"Proposal sent\",N:N) totals the value of open proposals if Stage is column I and Deal value is column N.",
          "**Stage counts.** =COUNTIF(I:I,\"Replied\") and similar for each stage, in a small summary block or second tab."
        ] },
        { type: "tip", text: "Resist the urge to build a dashboard on day one. Get the routine working for a month, then add the one or two summary numbers you actually look at." }
      ]
    },
    {
      heading: "A daily and weekly routine",
      blocks: [
        { type: "p", text: "The spreadsheet only works if you use it at the same time every day. Here is a routine that takes about ten minutes daily and twenty minutes weekly." },
        { type: "p", text: "**Daily (10 minutes):**" },
        { type: "ol", items: [
          "Filter out Won, Lost and Do not contact.",
          "Sort by Next action date, oldest first.",
          "Work down the list: send each due message, update Last contact date, Touches, Next action and Next action date.",
          "Log any replies that came in and move those leads to the right stage."
        ] },
        { type: "p", text: "**Weekly (20 minutes, same day each week):**" },
        { type: "ol", items: [
          "Add new leads to Researching, enough to keep a steady flow. A rough rule of thumb is 10 to 20 well-qualified new companies a week if outreach is your main source of work.",
          "Move stale leads: anything with three or four touches and no reply goes to Lost or Not now.",
          "Check each Proposal sent row and decide the next nudge.",
          "Look at your counts: how many contacted, replied, booked and won this week."
        ] },
        { type: "p", text: "Most leads need several touches, so the follow-up columns do most of the work here. For timing and wording, see our guide to [follow-up emails](/guides/follow-up-emails)." }
      ]
    },
    {
      heading: "Reading your numbers",
      blocks: [
        { type: "p", text: "After a month or two you will have enough rows to spot patterns. You do not need fancy charts; a few ratios tell you where to focus." },
        { type: "ul", items: [
          "**Low reply rate** (lots of Contacted, few Replied): your targeting or first message needs work. Check that leads have a real signal, and revisit [cold emails that get replies](/guides/cold-email-that-gets-replies).",
          "**Replies but few calls:** your follow-up after a reply is too slow or the ask is too big. Offer a specific, short next step.",
          "**Calls but few wins:** look at your qualification and pricing conversations. The [lead qualification](/guides/lead-qualification) guide helps here.",
          "**Wins concentrated in one signal or industry:** do more of that. Filter by the Signal column to see which reasons for reaching out actually convert."
        ] },
        { type: "p", text: "Keep the reasons in the Notes column short and consistent ('price', 'timing', 'in-house', 'no reply') so you can filter and count them." }
      ]
    },
    {
      heading: "Privacy and housekeeping",
      blocks: [
        { type: "p", text: "Your lead sheet holds personal data: names, roles and work email addresses. In the UK and EU in particular, privacy law expects you to keep only what you need, know where it came from, and not keep it forever. That is good practice everywhere." },
        { type: "ul", items: [
          "Keep the Source column filled in for every contact.",
          "Do not store sensitive or personal details that have nothing to do with the business conversation.",
          "Restrict sharing. If you use Google Sheets, do not leave it as 'anyone with the link'.",
          "Every few months, delete or anonymize leads that are Lost and that you do not plan to revisit.",
          "Honor opt-outs instantly and keep the suppression list."
        ] },
        { type: "p", text: "For a fuller picture of the rules, see our summary of [cold outreach laws](/guides/cold-outreach-laws)." }
      ]
    },
    {
      heading: "Filling the sheet with good leads",
      blocks: [
        { type: "p", text: "A tracker is only as good as the leads you put in it. If most rows are companies with no clear reason to need you, the routine will feel like busywork. Aim to add companies with a visible, current signal, like a job post for a role you can cover or a recent launch; our guides to [buying signals](/guides/buying-signals) and [job posts as leads](/guides/job-posts-as-leads) explain what to look for." },
        { type: "p", text: "If you would rather not build the list by hand, [FindMyClients](/) finds companies with a current need, scores them for fit, drafts a first message, and lets you export your pipeline to Excel. The exported columns drop straight into a layout like the one above, so you can keep running your daily and weekly routine in your own sheet." }
      ]
    }
  ],
  faqs: [
    {
      q: "Can I use Excel or Google Sheets as a CRM?",
      a: "Yes. For a solo freelancer or small agency, a spreadsheet with clear columns, a stage dropdown and a next action date covers most of what a CRM does. It becomes limiting when several people edit the same leads, you track well over a hundred active conversations, or you need email history logged automatically. Until then, it is often faster and cheaper."
    },
    {
      q: "What columns should a lead tracking spreadsheet have?",
      a: "At minimum: company, website, country, contact name and role, contact route, source, signal, fit score, stage, last contact date, touches, next action, next action date, deal value and notes. The three that matter most day to day are stage, next action and next action date, because they tell you exactly what to do each morning."
    },
    {
      q: "What are good pipeline stages for freelancers?",
      a: "Keep it to about eight: Researching, Contacted, Replied, Call booked, Proposal sent, Won, Lost and Not now. Add Do not contact for anyone who opted out. Fewer stages means less time deciding where a lead belongs and clearer counts when you review your week. Use a dropdown so the values stay consistent."
    },
    {
      q: "How often should I update my lead tracker?",
      a: "Every working day for about ten minutes: sort by next action date, send what is due and update the row straight away. Then once a week, spend twenty minutes adding new leads, closing out stale ones and checking your counts. Updating immediately after each send is what keeps the sheet trustworthy."
    },
    {
      q: "How do I set follow-up reminders in a spreadsheet?",
      a: "Keep a next action date column and use conditional formatting to turn it red when the date has passed and yellow when it is today. A formula like WORKDAY on the last contact date can suggest the next date automatically. Sorting by that column each morning works as a simple reminder system without any extra software."
    }
  ],
  related: {
    guides: ["follow-up-emails", "lead-qualification", "buying-signals", "how-to-find-clients-as-a-freelancer"],
    templates: ["follow-up-email", "breakup-email"],
    professions: ["bookkeepers", "graphic-designers", "video-editors"]
  }
};
