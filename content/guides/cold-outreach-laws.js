export default {
  slug: "cold-outreach-laws",
  title: "Cold outreach laws: CAN-SPAM, GDPR, PECR and CASL for freelancers",
  metaTitle: "Cold Email Laws: CAN-SPAM, GDPR, PECR and CASL Basics",
  description: "A plain-English overview of the US, EU, UK and Canadian rules on B2B cold email for freelancers: what each law requires, how they differ, and a checklist.",
  excerpt: "Is cold emailing legal? Usually, if you follow the rules of the country you are sending to. Here is what CAN-SPAM, GDPR, PECR and CASL expect from a freelancer.",
  category: "Compliance",
  updated: "2026-10-03",
  readingMinutes: 9,
  keyTakeaways: [
    "The law that matters is usually the one where the recipient is, not where you are.",
    "The US (CAN-SPAM) allows B2B cold email without prior consent, but requires honest headers, a postal address and a working opt-out.",
    "In the EU and UK, a named work email is personal data: you need a lawful basis (often legitimate interest) plus compliance with national e-marketing rules, which differ by country and by type of recipient.",
    "Canada (CASL) is the strictest of the four: you need consent, though implied consent can apply to addresses that are published conspicuously and messages relevant to the person's job.",
    "Everywhere: be truthful, identify yourself, make opting out easy, and honor opt-outs quickly and permanently."
  ],
  sections: [
    {
      heading: "Read this first: this is not legal advice",
      blocks: [
        { type: "p", text: "**This guide is general information, not legal advice.** Laws change, regulators update their guidance, and how a rule applies depends on your facts: who you are emailing, where they are, how you got their address, and what you are offering. If outreach is a big part of your business, or you are targeting a country with strict rules, check the official regulator's guidance or speak to a lawyer in that country." },
        { type: "p", text: "What this guide does is give you a working map of the four regimes freelancers run into most often: the United States, the European Union, the United Kingdom and Canada. It focuses on **one-to-one B2B cold email** (you writing to a business about a service it might need), which is treated differently from bulk marketing to consumers in several of these places." },
        { type: "tip", text: "A useful default: the rules of the recipient's country apply to the recipient. A freelancer in Lahore emailing a company in Toronto needs to think about Canadian law, not Pakistani law." }
      ]
    },
    {
      heading: "United States: CAN-SPAM",
      blocks: [
        { type: "p", text: "The CAN-SPAM Act covers commercial email in the US, and it applies to business-to-business email as well as messages to consumers. It is enforced by the **Federal Trade Commission (FTC)**. Unlike the EU or Canada, CAN-SPAM does **not** require prior consent. You can send a cold email to a business as long as you follow the rules about content and opting out." },
        { type: "p", text: "The core requirements, as described in the FTC's [CAN-SPAM compliance guide for business](https://www.ftc.gov/business-guidance/resources/can-spam-act-compliance-guide-business):" },
        { type: "ul", items: [
          "**No false or misleading header information.** Your From name, From address and reply-to must accurately identify you.",
          "**No deceptive subject lines.** The subject must reflect what the email is about. No fake 'Re:' or 'Your invoice'.",
          "**Identify the message as an ad** where it is one. The FTC allows flexibility in how, but it must be clear.",
          "**Include a valid physical postal address.** A street address, a post office box, or a private mailbox registered under postal regulations.",
          "**Tell recipients how to opt out** of future email from you, in a clear and easy way.",
          "**Honor opt-outs promptly.** The FTC guide says within 10 business days, without charging a fee or asking for more than an email address, and you cannot sell or transfer the address afterwards.",
          "**You are responsible for what others send for you.** Hiring someone to do your outreach does not move the obligation off you."
        ] },
        { type: "p", text: "Penalties can apply per email, which adds up fast. Several US states also have their own rules on deceptive email, so honesty matters beyond the federal law." }
      ]
    },
    {
      heading: "European Union: GDPR plus national ePrivacy rules",
      blocks: [
        { type: "p", text: "In the EU, two layers apply at the same time, and people often mix them up." },
        { type: "p", text: "**Layer 1: the GDPR.** An email address that identifies a person, like maria.lopez@company.es, is personal data, even though it is a work address. To process it (find it, store it, email it) you need a lawful basis. For B2B outreach this is usually **legitimate interest** (Article 6(1)(f)). The GDPR's recitals say direct marketing may be a legitimate interest, but you have to do a balancing test: is your interest in contacting this person outweighed by their rights and reasonable expectations? Emailing a marketing director about a marketing service is easier to justify than emailing a junior employee about something unrelated to their role." },
        { type: "p", text: "The GDPR also gives people rights you need to respect in practice:" },
        { type: "ul", items: [
          "**Transparency.** When you collect someone's data from a source other than them, you generally have to tell them who you are, where you got their details and what you will do with them, at the latest in your first communication. A short line plus a link to a simple privacy notice covers most of this.",
          "**The right to object to direct marketing.** If someone says stop, you must stop. There is no balancing test for this one.",
          "**Data minimization and retention.** Keep only what you need (name, role, company, work email, source) and delete leads you are no longer pursuing."
        ] },
        { type: "p", text: "**Layer 2: national e-marketing (ePrivacy) rules.** The EU ePrivacy Directive requires prior consent for email marketing to individuals, with limited exceptions such as existing customers. But it leaves each member state to decide how to treat emails to businesses and other legal persons. That is why B2B cold email rules **vary by country**. Germany, for example, is known for being strict and generally expects consent even in many B2B situations. France's regulator, the CNIL, takes a more permissive view of B2B email where the message relates to the recipient's professional role and they can opt out. Other countries sit in between." },
        { type: "tip", text: "Before running outreach into a specific EU country, look up that country's data protection authority guidance on B2B email marketing. It is usually a short page and it settles most questions." }
      ]
    },
    {
      heading: "United Kingdom: UK GDPR and PECR",
      blocks: [
        { type: "p", text: "After Brexit the UK kept its own version of the GDPR (the **UK GDPR**) alongside the **Privacy and Electronic Communications Regulations (PECR)**. Both are overseen by the **Information Commissioner's Office (ICO)**, which publishes clear guidance on direct marketing at [ico.org.uk](https://ico.org.uk). The UK has also been updating parts of this framework, so check the ICO for the latest position." },
        { type: "p", text: "PECR's email rules turn on who the **subscriber** is, meaning who holds the email account:" },
        { type: "ul", items: [
          "**Corporate subscribers:** limited companies, limited liability partnerships, Scottish partnerships and government bodies. PECR's consent rule for marketing email does **not** apply to them, so you can send a B2B cold email to an employee at a company address. You must still say who you are and give a valid address for opting out.",
          "**Individual subscribers:** this includes **sole traders and some partnerships** (in England, Wales and Northern Ireland, ordinary partnerships that are not LLPs). For these you need consent, unless the 'soft opt-in' for existing customers applies. A freelance plumber or a two-partner accountancy firm is likely an individual subscriber."
        ] },
        { type: "p", text: "On top of PECR, the UK GDPR still applies to a named person's work email at a company, so the legitimate interest test, transparency and the right to object all apply, just as in the EU. The ICO's guidance is that you should respect objections from employees at corporate addresses too." },
        { type: "p", text: "In practice: pitching your design services to the head of marketing at a UK limited company is generally fine if you are honest, relevant and offer an opt-out. Cold emailing a self-employed sole trader without consent is where people get caught out." }
      ]
    },
    {
      heading: "Canada: CASL",
      blocks: [
        { type: "p", text: "Canada's Anti-Spam Legislation (**CASL**) is the strictest of the four for cold outreach. It is enforced mainly by the **Canadian Radio-television and Telecommunications Commission (CRTC)**. CASL applies to commercial electronic messages sent to or accessed from computers in Canada, and it covers B2B messages too." },
        { type: "p", text: "The basic rule is that you need **consent** before sending a commercial electronic message, and every message must identify you, include your contact information and include a working unsubscribe mechanism. Consent can be express (they said yes) or **implied** in specific situations, including:" },
        { type: "ul", items: [
          "**Existing business relationships**, such as a recent purchase or contract, within time limits set by the law.",
          "**Conspicuous publication:** the person or business has published their email address publicly (for example on their website), has not said they do not want unsolicited messages, and your message is relevant to their business or role.",
          "**Disclosure to you:** they gave you their address (say, on a business card) without saying they did not want messages, and your message relates to their role."
        ] },
        { type: "p", text: "Two practical consequences. First, the conspicuous-publication exception is narrow: a general info@ address on a site, with your message relevant to the business, is a much safer bet than a personal address you guessed or bought. Second, under CASL an email that asks for consent is itself treated as a commercial message, so 'May I send you marketing emails?' sent cold does not get around the rule." },
        { type: "tip", text: "If you cannot point to a specific implied-consent reason for a Canadian lead, consider a different first channel, like a LinkedIn connection note, a phone call to a published business line, or a referral." }
      ]
    },
    {
      heading: "Elsewhere: check before you send",
      blocks: [
        { type: "p", text: "Many other countries have their own rules. Australia's Spam Act, overseen by the ACMA, is consent-based with its own inferred-consent rules. Gulf and South Asian countries have a mix of telecom, data protection and anti-spam rules that are developing quickly. If a market matters to you, find the national regulator's page on electronic marketing and read it once. It is time well spent." },
        { type: "p", text: "Channel matters too. Rules for calls, texts and messaging apps are often stricter than for email. If you plan to contact businesses on WhatsApp, read our guide to [WhatsApp business outreach](/guides/whatsapp-business-outreach) first." }
      ]
    },
    {
      heading: "A practical checklist that keeps you on the safe side",
      blocks: [
        { type: "p", text: "You cannot satisfy every country's rules perfectly from one template, but these habits cover most of the ground and are simply good practice:" },
        { type: "ol", items: [
          "**Know where the recipient is** and which regime applies. Note the country in your lead tracker.",
          "**Email businesses, about business.** Target people whose job relates to what you sell. Relevance is central to legitimate interest in the EU and UK and to implied consent in Canada.",
          "**Use public, business contact details** from the company's own site or official listings. Avoid guessed personal addresses and bought lists. Our guide to [finding business contact details](/guides/find-business-contact-details) explains how.",
          "**Be honest everywhere:** real name, real From address, accurate subject line.",
          "**Identify yourself fully** in the signature: your name or business name, a postal address and how to reach you.",
          "**Include a simple opt-out** like 'If you'd rather not hear from me, reply stop and I won't email again.'",
          "**Mention your source** in a short line where the GDPR or UK GDPR applies, and link to a short privacy notice.",
          "**Honor opt-outs immediately and permanently.** Keep a suppression list so they are never re-added.",
          "**Keep volumes human.** One-to-one, personalized messages are a different activity from blasting a list, both legally and in how spam filters treat you.",
          "**Delete stale leads** you are no longer pursuing, and record when and why you contacted each one."
        ] },
        { type: "p", text: "[FindMyClients](/) is built around this approach: it only shows public company contact details, drafts a message for you to review, and never sends anything on your behalf. You stay in control of who you contact and how, which also means the compliance decisions remain yours." }
      ]
    },
    {
      heading: "Common myths about cold email law",
      blocks: [
        { type: "ul", items: [
          "**'Cold email is illegal in Europe.'** Not as a blanket rule. It depends on the country, the type of recipient and whether you meet the GDPR's requirements. Some countries are strict; others allow relevant B2B email with an opt-out.",
          "**'If the address is public, I can email it anything.'** Public does not mean consent. In Canada and the EU, relevance to the person's role matters, and in the UK sole traders are treated like consumers.",
          "**'Adding an unsubscribe link makes any email legal.'** It is one requirement among several. It does not fix a misleading subject line or a missing lawful basis.",
          "**'It's B2B, so privacy law doesn't apply.'** A named person's work email is personal data under the GDPR and UK GDPR.",
          "**'One email doesn't count.'** These laws generally apply per message, not only to bulk campaigns."
        ] },
        { type: "p", text: "Staying compliant also tends to improve results. Relevant, honest, well-targeted messages are the same ones that get replies. If you want help with the targeting side, see our guide to [lead qualification](/guides/lead-qualification)." }
      ]
    }
  ],
  faqs: [
    {
      q: "Is cold emailing businesses legal?",
      a: "In many countries, yes, if you follow the local rules. In the US, CAN-SPAM allows B2B cold email without consent as long as you are honest, include a postal address and honor opt-outs. The EU and UK allow it in many B2B cases under legitimate interest and national rules, while Canada's CASL usually needs express or implied consent. This is general information, not legal advice."
    },
    {
      q: "Does GDPR apply to business email addresses?",
      a: "Yes, when the address identifies a person, such as firstname.lastname@company.com. That is personal data, so you need a lawful basis to use it, usually legitimate interest for B2B outreach, and you must respect rights like the right to object. A generic address like info@company.com is less likely to be personal data, though national e-marketing rules can still apply to emailing it."
    },
    {
      q: "Can I cold email sole traders in the UK?",
      a: "Be careful. Under PECR, sole traders and some partnerships count as individual subscribers, so the consent rules for marketing email apply to them, much like consumers. You generally need their consent unless the soft opt-in for existing customers applies. Limited companies and LLPs are corporate subscribers and are treated more permissively. Check the ICO's direct marketing guidance for the current position."
    },
    {
      q: "What does CASL implied consent from a published email address mean?",
      a: "Under Canada's CASL, consent can be implied if a business or person has conspicuously published their email address, has not said they do not want unsolicited messages, and your message is relevant to their business or role. It does not cover guessed addresses or messages unrelated to their job. If you cannot show that link, treat the lead as needing express consent."
    },
    {
      q: "Do I need an unsubscribe link in a one-to-one cold email?",
      a: "You need a clear way to opt out, but it does not have to be a link from a mailing platform. A plain line such as 'Reply stop and I won't contact you again' can work for personal one-to-one email, as long as you honor it promptly. Whatever method you use must actually work, and you should keep a list of people who opted out."
    }
  ],
  related: {
    guides: ["find-business-contact-details", "cold-email-that-gets-replies", "whatsapp-business-outreach", "follow-up-emails"],
    templates: ["cold-email-website-redesign", "breakup-email"],
    professions: ["marketing-agencies", "bookkeepers"]
  }
};
