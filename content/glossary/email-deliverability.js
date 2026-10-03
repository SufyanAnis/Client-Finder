export default {
  slug: "email-deliverability",
  term: "Email deliverability",
  metaTitle: "What is email deliverability? Definition and basics",
  description: "Email deliverability is whether your emails reach the inbox, not spam. The basics freelancers need: authentication, sender reputation, volume and content.",
  short: "Email deliverability is the likelihood that an email you send lands in the recipient's inbox, rather than the spam folder or being rejected outright.",
  blocks: [
    { type: "p", text: "Deliverability is not the same as delivery. An email can be \"delivered\" (accepted by the receiving server) and still go straight to spam, where nobody reads it. For freelancers doing cold outreach, deliverability problems are invisible: you just see a low [reply rate](/glossary/reply-rate) and assume the message was bad." },
    { type: "p", text: "Mailbox providers such as Gmail and Microsoft decide where your email goes based on several factors:" },
    { type: "ul", items: [
      "**Authentication:** whether your domain publishes [SPF](/glossary/spf-record), [DKIM](/glossary/dkim) and [DMARC](/glossary/dmarc) records and your mail passes them.",
      "**Sender reputation:** the history of your domain and sending IP, including spam complaints and bounces.",
      "**Engagement:** whether recipients open, reply, delete unread, or mark you as spam.",
      "**Volume patterns:** a new mailbox suddenly sending hundreds of emails looks suspicious.",
      "**Content:** heavy links, images, tracking pixels and spam-trigger phrasing can count against you."
    ] },
    { type: "p", text: "For a small business, the practical steps are simple. Authenticate your domain. Send at modest volumes, ramping up slowly with [email warm-up](/glossary/email-warm-up). Write plain-text, personal emails. Verify addresses before sending so you do not rack up bounces. Make opting out easy, because a quick unsubscribe is far better for your reputation than a spam complaint." },
    { type: "p", text: "Many freelancers send outreach from a separate domain (for example, a variation of your main brand) so a reputation problem does not affect invoices and client email on the main one. That only helps if the second domain is also set up and authenticated properly." },
    { type: "p", text: "Pitfalls: buying lists, sending from free consumer mailboxes at volume, adding open tracking to every cold email, and ignoring bounce messages. Deliverability is also easier to protect than to repair, so start careful." },
    { type: "tip", text: "Send a test email to a personal Gmail and Outlook account, open the full headers, and check that SPF, DKIM and DMARC all show pass. The [deliverability post](/blog/cold-email-deliverability) covers the full setup." }
  ],
  example: "A fictional design studio sends 200 cold emails on day one from a new domain with no DKIM. Replies are near zero. After authenticating the domain and dropping to about 20 a day, replies start coming back within two weeks.",
  related: {
    glossary: ["spf-record", "dkim", "dmarc", "email-warm-up"],
    guides: ["cold-email-that-gets-replies"],
    blog: ["cold-email-deliverability", "how-many-cold-emails-per-day"],
    templates: ["cold-email-website-redesign"]
  }
};
