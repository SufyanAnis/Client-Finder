export default {
  slug: "pecr",
  term: "PECR",
  metaTitle: "What is PECR? UK electronic marketing rules",
  description: "PECR is the UK law on electronic marketing, enforced by the ICO. How it treats cold emails to companies versus sole traders, and how it works with UK GDPR.",
  short: "PECR (the Privacy and Electronic Communications Regulations 2003) is the UK law, enforced by the ICO, governing electronic marketing by email, text, phone and cookies.",
  blocks: [
    { type: "p", text: "This is a simplified summary, not legal advice. The regulator is the Information Commissioner's Office (ICO); its [guide to PECR](https://ico.org.uk/for-organisations/direct-marketing-and-privacy-and-electronic-communications/guide-to-pecr/) is the authoritative source. PECR has been amended over time, including by the Data (Use and Access) Act 2025, so check the ICO's current guidance before relying on any summary." },
    { type: "p", text: "PECR sits alongside UK GDPR. UK GDPR governs how you handle personal data; PECR adds specific rules for marketing messages. For freelancers emailing UK prospects, the key distinction is who you are writing to:" },
    { type: "ul", items: [
      "**Corporate subscribers** (limited companies, LLPs, Scottish partnerships, government bodies): PECR's consent rule for marketing emails does not apply, so B2B cold email is generally allowed. You must still identify yourself and provide a valid contact address for opting out.",
      "**Individual subscribers** (sole traders and some partnerships): marketing emails generally need prior consent, unless the \"soft opt-in\" applies, which covers existing customers and similar products.",
      "**Phone and text** have their own rules, including checking registers such as the Telephone Preference Service and Corporate TPS for calls."
    ] },
    { type: "p", text: "Even when PECR allows a B2B email, UK GDPR still applies if the address identifies a person, such as firstname@company.co.uk. You need a lawful basis, usually [legitimate interest](/glossary/legitimate-interest), you must be transparent if asked, and you must honor objections." },
    { type: "p", text: "Practical steps for small agencies: check whether the prospect is a limited company or a sole trader before emailing (Companies House is a quick check), write to role-relevant people, keep messages individual and relevant, include who you are and how to opt out, and keep a suppression list." },
    { type: "tip", text: "Many small UK businesses, such as tradespeople, salons and consultants, are sole traders. For them, a phone call or a reply to their own published enquiry route is often safer than a cold marketing email." }
  ],
  example: "A fictional freelance copywriter checks Companies House before emailing UK leads. Northgate Interiors Ltd gets a short cold email with an opt-out line; a sole-trader plumber does not, and she reaches out through his website's quote form instead.",
  related: {
    glossary: ["legitimate-interest", "can-spam", "casl", "cold-email"],
    guides: ["cold-outreach-laws", "find-business-contact-details"],
    blog: ["find-local-business-clients", "cold-calling-for-freelancers"],
    templates: []
  }
};
