export default {
  slug: "casl",
  term: "CASL",
  metaTitle: "What is CASL? Canada's anti-spam law explained",
  description: "CASL is Canada's anti-spam law, enforced mainly by the CRTC. It generally requires consent before commercial email, with narrow exceptions. Freelancer basics.",
  short: "CASL (Canada's Anti-Spam Legislation) is a Canadian law, enforced mainly by the CRTC, requiring consent, sender identification and an unsubscribe option for commercial electronic messages.",
  blocks: [
    { type: "p", text: "This is a simplified overview, not legal advice. The Canadian Radio-television and Telecommunications Commission (CRTC) is the main enforcer, with the Competition Bureau and the Office of the Privacy Commissioner handling other parts. The CRTC's [anti-spam guidance](https://crtc.gc.ca/eng/internet/anti.htm) is the official starting point." },
    { type: "p", text: "CASL is stricter than the US [CAN-SPAM](/glossary/can-spam) Act because it is broadly a consent-based law. It applies to commercial electronic messages (email, text, and some social media direct messages) sent to or accessed from a computer in Canada, including B2B messages. For freelancers and small agencies, that means you cannot assume a Canadian company's address is fair game just because you found it." },
    { type: "p", text: "Every commercial message generally needs three things:" },
    { type: "ol", items: [
      "**Consent**, either express (they agreed) or implied under specific conditions.",
      "**Identification** of who is sending, with contact information.",
      "**A working unsubscribe mechanism**, with requests processed within 10 business days."
    ] },
    { type: "p", text: "Implied consent is where cold B2B outreach usually lives, and it is narrow. Situations include an existing business relationship (for example, a recent purchase or contract), and **conspicuous publication**: the person has publicly published their address, has not stated they do not want unsolicited messages, and your message is relevant to their business role. An address you were given directly, without a do-not-contact statement, can also qualify if the message relates to their role." },
    { type: "p", text: "Practical steps: keep a note of where and when you found each Canadian contact and whether the source said \"no solicitations\", write only about services relevant to that person's job, include your name, business and contact details, offer an easy opt-out, and honor it fast. When in doubt, a [warm lead](/glossary/warm-lead) route, such as an introduction or responding to a public request, is safer." },
    { type: "tip", text: "Screenshot or note the page where a contact's address was published. If anyone ever asks how you got their details, you have an answer." }
  ],
  example: "A fictional Dubai-based UX designer finds a Toronto startup's founder listing her email on the company site for partnership enquiries. He writes one relevant message about their onboarding flow, includes his details and an opt-out, and records the source page.",
  related: {
    glossary: ["can-spam", "pecr", "legitimate-interest", "cold-email"],
    guides: ["cold-outreach-laws", "find-business-contact-details"],
    blog: ["find-international-clients"],
    templates: []
  }
};
