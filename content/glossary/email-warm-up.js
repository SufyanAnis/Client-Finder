export default {
  slug: "email-warm-up",
  term: "Email warm-up",
  metaTitle: "What is email warm-up? Definition and how to do it",
  description: "Email warm-up means slowly raising sending volume from a new mailbox or domain to build sender reputation. A safe manual ramp for freelancers doing outreach.",
  short: "Email warm-up is the practice of gradually increasing how many emails a new mailbox or domain sends, so mailbox providers build trust in it before outreach volume rises.",
  blocks: [
    { type: "p", text: "A brand-new domain or mailbox has no sending history. If it suddenly sends a large batch of emails to strangers, mailbox providers treat that as a classic spam pattern. Warm-up builds a track record first: small volumes, real conversations, few bounces and no complaints, then slowly more." },
    { type: "p", text: "For freelancers this matters most when you set up a separate outreach domain, which many people do to protect their main business email. That new domain starts with zero reputation, so it needs a few weeks of normal use before it carries cold outreach at any volume." },
    { type: "p", text: "A simple manual approach, as a rule of thumb rather than a fixed formula:" },
    { type: "ol", items: [
      "Set up [SPF](/glossary/spf-record), [DKIM](/glossary/dkim) and [DMARC](/glossary/dmarc) before sending anything.",
      "For the first week or two, use the mailbox normally: emails to people you know, newsletter sign-ups, replies.",
      "Start outreach at a handful of carefully researched emails per day.",
      "Increase gradually over several weeks while watching bounces, replies and spam complaints.",
      "Settle at a modest daily ceiling per mailbox rather than chasing volume."
    ] },
    { type: "p", text: "There are also automated warm-up services that send and reply to emails between a network of mailboxes to simulate engagement. Opinions on them vary. Some mailbox providers may view artificial engagement unfavorably, and no warm-up service can offset poorly targeted sending. Real, relevant emails that get real replies remain the best reputation builder." },
    { type: "p", text: "Pitfalls: skipping warm-up because you are in a hurry, warming up and then jumping straight to high volume, and assuming a warmed mailbox stays warm forever. If you stop sending for a month, ease back in." },
    { type: "tip", text: "Track daily sends next to replies and bounces in your lead sheet. If bounces rise above a few percent, pause, clean your list, and slow down. The [daily volume post](/blog/how-many-cold-emails-per-day) goes deeper." }
  ],
  example: "A fictional web developer registers a second domain for outreach, uses it for normal email for ten days, then starts at five cold emails a day and moves up to around twenty over the following month.",
  related: {
    glossary: ["email-deliverability", "spf-record", "dkim", "dmarc"],
    guides: ["cold-email-that-gets-replies"],
    blog: ["how-many-cold-emails-per-day", "cold-email-deliverability"],
    templates: []
  }
};
