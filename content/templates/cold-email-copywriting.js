export default {
  slug: "cold-email-copywriting",
  title: "Cold email template: copywriting pitch",
  metaTitle: "Copywriting Cold Email Template (Real Example)",
  description: "A cold email template for copywriters that rewrites one line of the prospect's own copy as proof. Placeholders, variations, an example and follow-up tips.",
  channel: "Email",
  useCase: "Send this when a company's website, product page or emails have copy that is vague, feature-heavy, or doesn't match what their customers actually say about them.",
  intro: [
    "A copywriter's cold email is itself a writing sample, which cuts both ways. A bland pitch disqualifies you instantly; a sharp one does half the selling. The strongest move is to show, not tell: take one real line from their site and rewrite it, so they can see the difference in their own context.",
    "Keep the rewrite small. One headline or one sentence is enough to prove you can write, and small enough that you're not giving away a free project. Pair it with a reason grounded in their customers, ideally something from their own reviews or testimonials, so it's clear your version isn't just personal taste."
  ],
  template: "Subject: a different headline for {company}\n\nHi {first name},\n\nYour homepage leads with '{their current line}'. It's accurate, but your reviews keep praising something more specific: {what customers say}.\n\nHere's a version that leads with that instead:\n\n'{your rewrite}'\n\nI write website and email copy for {type of business}, usually starting with exactly this: finding the words customers already use and putting them where people decide.\n\nIf you'd like, I'll do the same for the rest of your homepage and send it as a short doc, free. Interested?\n\n{your name}",
  placeholders: [
    { key: "{their current line}", fill: "Quote their headline or a key sentence exactly. Pick one that's generic ('Quality solutions for your business') rather than one that's simply not to your taste." },
    { key: "{what customers say}", fill: "A theme from reviews, testimonials or case studies: 'that you reply within an hour', 'that the fit is right first time'. Summarize; don't quote named reviewers." },
    { key: "{your rewrite}", fill: "One headline, under about 12 words, that uses the customer theme. Write five and send the best one." },
    { key: "{type of business}", fill: "The niche you work in. Specific beats broad: 'B2B software companies' or 'independent hotels'." },
    { key: "{first name}", fill: "The founder or marketing lead. In small firms, the founder usually wrote the current copy, so be respectful about it." }
  ],
  whyItWorks: [
    "The rewrite is instant proof. They can judge your skill in five seconds without clicking a portfolio link.",
    "Grounding the rewrite in their customers' words makes it an insight, not an opinion, and it's hard to argue with your own reviews.",
    "'It's accurate, but' acknowledges the current line isn't wrong, which avoids putting the writer of it on the defensive.",
    "The offer is generous but bounded: one page, one doc."
  ],
  variations: [
    { label: "Product or service page angle", text: "Subject: {product} page at {company}\n\nHi {first name},\n\nThe {product} page lists features first: {feature list}. Customers in your reviews talk about the result instead: {what customers say}.\n\nA quick rewrite of the opening:\n\n'{your rewrite}'\n\nI write product copy for {type of business}. Want me to redo the whole page as a sample?\n\n{your name}" },
    { label: "Email newsletter angle", text: "Subject: your last newsletter's subject line\n\nHi {first name},\n\nI'm on {company}'s list. Your last email, '{their subject line}', had a great story inside, {story detail}, but the subject line didn't hint at it.\n\nSomething like '{your rewrite}' might get more people to open. I write emails for {type of business}; happy to send a few more ideas.\n\n{your name}" }
  ],
  filledExample: {
    context: "A freelance copywriter notices that Copperleaf Tailoring, a fictional alterations studio, has a generic homepage headline while its reviews repeatedly praise its fast turnaround.",
    text: "Subject: a different headline for Copperleaf Tailoring\n\nHi Grace,\n\nYour homepage leads with 'Quality tailoring and alterations for every occasion'. It's accurate, but your reviews keep praising something more specific: that a suit can come back fitted within 48 hours.\n\nHere's a version that leads with that instead:\n\n'Fitted perfectly, ready in 48 hours.'\n\nI write website and email copy for independent shops and studios, usually starting with exactly this: finding the words customers already use and putting them where people decide.\n\nIf you'd like, I'll do the same for the rest of your homepage and send it as a short doc, free. Interested?\n\nOwen Mercer"
  },
  mistakes: [
    "Criticizing their copy harshly. The founder may have written it, and nobody hires the person who called their work bad.",
    "Rewriting their whole homepage unprompted. It's too much free work, and it's easy for them to just use it.",
    "Writing a long, clever email. If your pitch is padded, they'll assume your copy will be too. Stay under about 120 words.",
    "Using buzzwords in a pitch about clear writing. Words like 'compelling' and 'engaging' undercut the message."
  ],
  followUp: "Wait about five working days. Then reply in the same thread with one more small rewrite, a different line from their site, and nothing else except a one-sentence note. It's the most natural follow-up a copywriter can send because it shows range and doesn't ask for anything new. If that goes unanswered too, a short [breakup email](/templates/breakup-email) a week later is enough. To find businesses whose copy undersells them, try describing your niche in [FindMyClients](/) and reviewing the top-scored sites.",
  related: {
    guides: ["cold-email-that-gets-replies", "ideal-client-profile", "follow-up-emails"],
    templates: ["cold-email-seo-audit", "cold-email-website-redesign", "breakup-email"],
    professions: ["copywriters", "marketing-agencies"]
  }
};
