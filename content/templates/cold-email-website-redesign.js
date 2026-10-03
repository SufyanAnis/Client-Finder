export default {
  slug: "cold-email-website-redesign",
  title: "Cold email template: website redesign pitch",
  metaTitle: "Website Redesign Cold Email Template (With Example)",
  description: "A short cold email template for pitching a website redesign, built around one specific problem you found on their site. Includes variations and an example.",
  channel: "Email",
  useCase: "Send this when a company's website has a visible, specific problem (slow mobile load, broken form, dated layout) that is plausibly costing them inquiries.",
  intro: [
    "Most redesign pitches fail because they open with an opinion: 'your site looks outdated.' The owner has heard it before, and nobody enjoys being told their baby is ugly by a stranger. What gets a reply is one checkable observation tied to inquiries or bookings.",
    "This template is built around that idea. You find one concrete problem, describe it in plain words, say what it probably costs them, and offer something small and useful rather than a full proposal. It works best for owner-led businesses (clinics, trades, restaurants, local services, small B2B firms) where the person reading the email can actually approve a project. If you'd rather not hunt for slow or dated sites by hand, [FindMyClients](/) flags that kind of gap when it scores companies for you."
  ],
  template: "Subject: {company}'s contact form on mobile\n\nHi {first name},\n\nI was looking at {company}'s site on my phone and noticed {specific problem}. For a business that relies on {how they get customers}, that's probably costing you a few inquiries a month without anyone noticing.\n\nI redesign sites for {type of business}, mostly focused on making them fast and easy to act on from a phone. Recently I {one short proof point}.\n\nIf it's useful, I can send a two-minute screen recording showing exactly what I saw and what I'd change first. No cost, no follow-up pitch unless you ask.\n\nWorth sending over?\n\n{your name}\n{your website}",
  placeholders: [
    { key: "{first name}", fill: "The owner, practice manager or marketing lead. On small sites the About or Team page usually names them. If you can only find a generic inbox, use 'Hi there' rather than guessing a name." },
    { key: "{company}", fill: "The trading name customers know, not the registered legal entity." },
    { key: "{specific problem}", fill: "One thing you actually saw, described neutrally. 'The booking button sits below three screens of text', 'the contact form returns an error when I submit it', 'the homepage took about eight seconds to load on 4G'. Change the subject line to match." },
    { key: "{how they get customers}", fill: "Your honest read of their main channel: 'people booking from Google Maps', 'walk-in enquiries from your local area', 'quote requests'." },
    { key: "{type of business}", fill: "Be narrow if you can: 'independent dental practices' reads better than 'businesses'." },
    { key: "{one short proof point}", fill: "A real, modest result or project. 'rebuilt a physio clinic's site so bookings could be made in two taps'. Don't inflate it." }
  ],
  whyItWorks: [
    "The subject line names their company and a real page element, so it reads like a note about them rather than a mass mailing.",
    "It leads with an observation they can verify in ten seconds. If it's true, you've earned credibility before you've asked for anything.",
    "The offer is a short screen recording, which is low effort for them to accept and shows your thinking better than a portfolio link.",
    "It ends with a yes/no question, which is easier to answer than 'let me know if you'd like to chat sometime'."
  ],
  variations: [
    { label: "Shorter version", text: "Subject: {company} site on mobile\n\nHi {first name},\n\nQuick one: on my phone, {specific problem} on {company}'s site. That's usually where visitors give up and call a competitor instead.\n\nI fix this kind of thing for {type of business}. Happy to send a short video showing what I'd change first, free.\n\nWant it?\n\n{your name}" },
    { label: "Dated-design angle (no clear bug)", text: "Subject: {company}'s homepage vs. what you actually offer\n\nHi {first name},\n\nYour Google reviews talk a lot about {thing customers praise}, but the homepage doesn't mention it until halfway down, and the photos look like they're from a few years ago.\n\nI help {type of business} rebuild their sites so the first screen says what customers already love about them. I could mock up a new first screen for {company} so you can see the difference. Interested?\n\n{your name}" }
  ],
  filledExample: {
    context: "A freelance web designer finds that Northgate Dental's online booking button is hidden below a long welcome paragraph on mobile.",
    text: "Subject: Northgate Dental's booking button on mobile\n\nHi Priya,\n\nI was looking at Northgate Dental's site on my phone and noticed the Book Online button sits below about three screens of welcome text. For a practice that relies on people booking straight from Google Maps, that's probably costing you a few appointments a month without anyone noticing.\n\nI redesign sites for independent dental and physio practices, mostly focused on making them fast and easy to book from a phone. Recently I rebuilt a physio clinic's site so a booking takes two taps.\n\nIf it's useful, I can send a two-minute screen recording showing exactly what I saw and what I'd change first. No cost, no follow-up pitch unless you ask.\n\nWorth sending over?\n\nSam Okafor\nsamokafor.design"
  },
  mistakes: [
    "Attaching a full redesign mockup nobody asked for. It's unpaid work that often misses context you don't have.",
    "Listing five problems. One clear issue is persuasive; five reads like an audit you're trying to sell them.",
    "Pitching a redesign when the real issue is a five-minute fix. If the form is broken, say so plainly, even if it means a smaller job. That honesty is often what wins the bigger one later."
  ],
  followUp: "If there's no reply after four or five working days, send one short follow-up that adds something new rather than 'just bumping this': for example, a single screenshot of the problem with an arrow on it, or a note that you checked again and it's still happening. Wait another week before a final, polite close. If they fix the issue themselves in the meantime, let it go; you were right, which is not a bad impression to leave. Our [follow-up email template](/templates/follow-up-email) has wording you can adapt.",
  related: {
    guides: ["cold-email-that-gets-replies", "buying-signals", "follow-up-emails"],
    templates: ["cold-email-seo-audit", "follow-up-email", "breakup-email"],
    professions: ["web-designers", "web-developers"]
  }
};
