export default {
  slug: "legitimate-interest",
  term: "Legitimate interest",
  metaTitle: "What is legitimate interest under GDPR? Definition",
  description: "Legitimate interest is a GDPR and UK GDPR lawful basis for processing personal data, including some B2B outreach. The three-part test, limits and records.",
  short: "Legitimate interest is one of six lawful bases under the GDPR and UK GDPR for processing personal data where your interest is genuine, necessary and not overridden by individuals' rights.",
  blocks: [
    { type: "p", text: "This is a general explanation, not legal advice. In the UK, the regulator is the Information Commissioner's Office (ICO), whose [legitimate interests guidance](https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/lawful-basis/legitimate-interests/) is the place to start. In the EU, each country has its own data protection authority." },
    { type: "p", text: "Legitimate interest is set out in Article 6(1)(f) of the GDPR. It matters for freelancers because B2B prospecting usually involves personal data: a named person's work email, their job title, notes about them in your spreadsheet. You need a lawful basis to collect and use that data, and for cold B2B outreach, legitimate interest is the basis most small businesses rely on. The GDPR's recitals note that direct marketing may be regarded as a legitimate interest, but it is not automatic." },
    { type: "p", text: "Regulators describe a three-part test, often written up as a Legitimate Interests Assessment (LIA):" },
    { type: "ol", items: [
      "**Purpose:** is there a genuine, specific interest, such as offering a relevant service to a business?",
      "**Necessity:** is processing this person's data actually needed for that purpose, and is there a less intrusive way?",
      "**Balancing:** would the person reasonably expect this, and does it override their interests or rights?"
    ] },
    { type: "p", text: "Two limits catch people out. First, legitimate interest covers the data processing, but separate electronic marketing rules can still require consent. In the UK that is [PECR](/glossary/pecr); in the EU, national ePrivacy laws vary. Second, people have an absolute right to object to direct marketing. Once someone says stop, you stop." },
    { type: "p", text: "Good practice for small businesses: collect only what you need, use business contact details relevant to the person's role, tell people where you got their details if asked, include an easy opt-out, and keep a short written LIA." },
    { type: "tip", text: "A one-page LIA written once and reviewed occasionally is far better than nothing. It shows you thought about the person on the other end." }
  ],
  example: "A fictional Manchester marketing agency writes a one-page assessment for emailing heads of marketing at UK software firms about a specific service, records where each contact came from, and removes anyone who objects.",
  related: {
    glossary: ["pecr", "can-spam", "casl", "cold-email"],
    guides: ["cold-outreach-laws", "find-business-contact-details"],
    blog: ["ai-for-finding-clients", "find-international-clients"],
    templates: []
  }
};
