export default {
  slug: "reply-rate",
  term: "Reply rate",
  metaTitle: "What is reply rate? Cold outreach metric explained",
  description: "Reply rate is the percentage of outreach messages that get a response. How to calculate it, why it beats open rate, and how freelancers can improve it.",
  short: "Reply rate is the percentage of outreach messages that receive a response, calculated as replies divided by messages delivered, multiplied by 100.",
  blocks: [
    { type: "p", text: "Reply rate is the most useful single number in cold outreach for freelancers and small agencies. It measures what you actually want: a conversation. Open rate, by contrast, has become unreliable because many email apps preload images or block tracking pixels, so opens are over- or under-counted." },
    { type: "example", label: "Worked example (illustrative numbers)", text: "Emails delivered: 80\nReplies of any kind: 6\nReply rate: 6 / 80 x 100 = 7.5%\n\nPositive replies (interested): 3\nPositive reply rate: 3 / 80 x 100 = 3.75%" },
    { type: "p", text: "Track both total and **positive** reply rate. A message that gets lots of \"please remove me\" replies has a high reply rate and a real problem. Count replies to the whole sequence, including follow-ups, since many responses come after the second or third message." },
    { type: "p", text: "There is no universal benchmark worth trusting. It depends heavily on niche, targeting, offer and deliverability. Your own past results are the best baseline: compare one month against the last, or one message variant against another." },
    { type: "ul", items: [
      "**Targeting:** writing to companies with a current [buying signal](/glossary/buying-signal) usually lifts replies more than any wording change.",
      "**Deliverability:** a sudden drop to near zero often means spam folders, not bad copy (see [email deliverability](/glossary/email-deliverability)).",
      "**Length and ask:** short emails with a simple yes or no question are easier to answer.",
      "**Follow-up:** a polite [follow-up cadence](/glossary/follow-up-cadence) catches people who were busy."
    ] },
    { type: "p", text: "Pitfalls: testing on tiny samples (five emails tell you nothing), changing several things at once so you cannot tell what worked, and optimizing for replies instead of booked calls and paid projects." },
    { type: "tip", text: "Test one change at a time across at least 30 to 50 sends before drawing a conclusion. A spreadsheet column for variant name is enough." }
  ],
  example: "A fictional UX designer sends 60 emails with a generic opener and gets 2 replies, then 60 emails that reference each company's recent app update and gets 7. She keeps the second approach.",
  related: {
    glossary: ["cold-email", "email-deliverability", "follow-up-cadence"],
    guides: ["cold-email-that-gets-replies", "follow-up-emails"],
    blog: ["cold-email-subject-lines", "best-time-to-send-cold-emails"],
    templates: ["follow-up-email", "breakup-email"]
  }
};
