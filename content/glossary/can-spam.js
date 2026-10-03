export default {
  slug: "can-spam",
  term: "CAN-SPAM Act",
  metaTitle: "What is the CAN-SPAM Act? Rules for cold email",
  description: "CAN-SPAM is the US law for commercial email, enforced by the FTC. What it requires of B2B cold emails: honest headers, a postal address and a working opt-out.",
  short: "The CAN-SPAM Act is a 2003 US federal law, enforced by the FTC, that sets rules for commercial email, including B2B messages, and gives recipients the right to opt out.",
  blocks: [
    { type: "p", text: "This is a plain-English summary, not legal advice. Check the Federal Trade Commission's own [CAN-SPAM compliance guide for business](https://www.ftc.gov/business-guidance/resources/can-spam-act-compliance-guide-business) or a lawyer for your situation." },
    { type: "p", text: "CAN-SPAM does not require prior consent. It is an opt-out law: you may send commercial email to US recipients, including business addresses, as long as you follow its rules. There is no exemption for B2B email. The FTC's main requirements include:" },
    { type: "ul", items: [
      "**No false or misleading header information.** The From, To, Reply-To and routing details must be accurate and identify who sent it.",
      "**No deceptive subject lines.** The subject must reflect the content. A fake \"Re:\" is a bad idea.",
      "**Identify the message as an ad** where it is one, clearly and conspicuously.",
      "**Include a valid physical postal address.** A street address, a registered post office box, or a private mailbox meeting postal regulations.",
      "**Tell recipients how to opt out**, and make it easy, such as replying or a single link.",
      "**Honor opt-outs promptly**, within 10 business days, and do not sell or transfer the address afterwards.",
      "**Monitor others acting for you.** You remain responsible if you hire someone to send on your behalf."
    ] },
    { type: "p", text: "For freelancers and small agencies, the practical setup is small: send from your real name and domain, write honest subject lines, add a short signature with your business postal address and a line such as \"If this is not relevant, just reply and I won't email again\", and keep a do-not-contact list you actually check." },
    { type: "p", text: "CAN-SPAM covers US law only. If you email people in the UK, EU or Canada, rules such as [PECR](/glossary/pecr), GDPR and [CASL](/glossary/casl) may also apply and are generally stricter. Mailbox provider rules on spam complaints also apply regardless of the law." },
    { type: "tip", text: "Freelancers working from home often use a virtual mailbox or registered office service rather than publishing a home address. Check that it meets the FTC's postal address requirement." }
  ],
  example: "A fictional Lahore-based developer emailing US clinics adds a signature with his business mailbox address and \"Reply 'no thanks' and I'll take you off my list\", then logs every opt-out in a do-not-contact column.",
  related: {
    glossary: ["cold-email", "pecr", "casl", "legitimate-interest"],
    guides: ["cold-outreach-laws", "cold-email-that-gets-replies"],
    blog: ["cold-email-deliverability", "find-international-clients"],
    templates: ["breakup-email"]
  }
};
