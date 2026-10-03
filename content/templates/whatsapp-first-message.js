export default {
  slug: "whatsapp-first-message",
  title: "WhatsApp first message template for business outreach",
  metaTitle: "WhatsApp Business Outreach Message Template",
  description: "A short, respectful WhatsApp first message template for businesses that publish a WhatsApp number, with a clear opt-out line, variations and an example.",
  channel: "WhatsApp",
  useCase: "Send this to a business that publicly lists a WhatsApp number for customer or business contact, in a market where WhatsApp is a normal business channel, when you have a specific reason to reach out.",
  intro: [
    "In much of the Gulf, South Asia, Latin America and parts of Africa and Europe, WhatsApp is how small businesses actually do business. Many shops, clinics and agencies print a WhatsApp number on their website or Google listing and expect inquiries there. In those markets, a polite, relevant message to that published number can be more welcome than an email that sits unread.",
    "That doesn't make WhatsApp a free-for-all. Only message numbers the business has published for contact, never a personal number you found elsewhere. Keep the first message short, say who you are and why you're writing, and give them an easy way to say no. WhatsApp's own business policies restrict unsolicited bulk messaging, and accounts that get blocked or reported often can be banned, so treat every message as one-to-one. Rules on direct marketing also differ by country; this is not legal advice. The [WhatsApp outreach guide](/guides/whatsapp-business-outreach) covers etiquette and local norms in more detail."
  ],
  template: "Hi, is this {company}? I'm {your name}, a {your role} based in {your city}.\n\nI noticed {specific observation}. I help {type of business} fix exactly that.\n\nWould it be okay to send a short example? If not, just reply 'no' and I won't message again.",
  placeholders: [
    { key: "{company}", fill: "The business name as it appears on their listing. Opening with 'is this {company}?' confirms you've reached the right number and feels natural on WhatsApp." },
    { key: "{your role} / {your city}", fill: "Short and local where possible: 'web designer based in Dubai'. Being nearby builds trust in many markets." },
    { key: "{specific observation}", fill: "One concrete thing: 'your Google listing shows the menu link is broken', 'your site doesn't load on mobile data'. Keep it neutral and checkable." },
    { key: "{type of business}", fill: "'restaurants in Karachi', 'clinics in Riyadh'. Narrow is better." }
  ],
  whyItWorks: [
    "Confirming the business name first is polite and quickly corrects you if the number has changed hands.",
    "It asks permission before sending anything, so no unsolicited links or attachments land in their chat.",
    "The opt-out line is explicit and costs them one word, which keeps the exchange respectful and reduces the chance of being reported.",
    "At around 50 words, it reads in a few seconds, which matters on a channel people check between customers."
  ],
  variations: [
    { label: "More formal (Gulf, corporate contacts)", text: "Good morning. Is this {company}? My name is {your name}, a {your role} in {your city}. I noticed {specific observation} and help {type of business} with this. May I send a short example? If you prefer not, please reply 'no' and I will not contact you again." },
    { label: "Shorter version", text: "Hi {company}, I'm {your name}, a local {your role}. I noticed {specific observation}. Can I send a quick example of how I'd fix it? Reply 'no' and I won't message again." }
  ],
  filledExample: {
    context: "A freelance web designer in Lahore sees that Zaitoon Garden Cafe, a fictional cafe, lists a WhatsApp number on its Google listing but its menu link leads to an error page.",
    text: "Hi, is this Zaitoon Garden Cafe? I'm Hamza, a web designer based in Lahore.\n\nI noticed the menu link on your Google listing opens an error page. I help cafes and restaurants fix exactly that.\n\nWould it be okay to send a short example? If not, just reply 'no' and I won't message again."
  },
  mistakes: [
    "Messaging personal numbers found on social profiles or through lookup sites. Stick to numbers published for business contact.",
    "Sending a link, PDF or voice note in the first message. It looks like spam, and messages from unknown numbers already come with a Block and Report option.",
    "Messaging outside business hours or on local rest days. Check their time zone and local weekend; in Saudi Arabia, for example, it falls on Friday and Saturday.",
    "Ignoring a 'no' or a non-reply. Never message again after an opt-out, and don't send more than one follow-up to silence."
  ],
  followUp: "WhatsApp shows read receipts, which tempts people to chase. Resist it. If the message is read but unanswered, wait at least three or four days, then send one short, friendly line, for example 'No worries if now's not a good time, the offer stands.' After that, stop. If they reply 'no' at any point, thank them and don't contact them again on any channel. [FindMyClients](/) only shows business contact numbers that companies publish themselves, which is the right starting point for this channel.",
  related: {
    guides: ["whatsapp-business-outreach", "cold-outreach-laws", "find-business-contact-details"],
    templates: ["cold-email-website-redesign", "follow-up-email", "linkedin-connection-request"],
    professions: ["web-designers", "social-media-managers", "graphic-designers"]
  }
};
