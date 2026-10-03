export default {
  slug: "cold-email-hiring-signal",
  title: "Cold email template: pitching when a company is hiring",
  metaTitle: "Cold Email Template for Companies That Are Hiring",
  description: "Turn a job post into a contract. A cold email template for freelancers offering to cover a role's work while the company hires. With example and variations.",
  channel: "Email",
  useCase: "Send this when a company has an open job post for a role you can cover as a contractor, especially if the post has been up for a few weeks.",
  intro: [
    "A job post is one of the clearest buying signals there is. The company has already admitted it needs the work done, gotten budget approved for it, and written down exactly what the work involves. What it doesn't have is someone doing that work today, and every week the seat stays empty, projects slip.",
    "This email doesn't ask them to cancel the hire. That's a hard sell and usually not your call to make. Instead it offers to cover the most urgent part of the role while they recruit, which is a much easier yes for a hiring manager. Plenty of 'temporary' contracts turn into ongoing retainers, and some roles get quietly rescoped into freelance work once the team sees it working. The [job posts as leads guide](/guides/job-posts-as-leads) covers how to pick which posts are worth pursuing."
  ],
  template: "Subject: {role title} role, help in the meantime?\n\nHi {first name},\n\nI saw {company} is hiring a {role title}. The post mentions {specific responsibility from the post}, which is exactly the work I do as a freelancer for {type of company}.\n\nHiring well takes a while. If it would help, I could take on {specific deliverable} on a short contract while you find the right person, so that work doesn't stall in the meantime.\n\nA recent example: {one relevant result}.\n\nOpen to a 15-minute call this week to see if it's a fit?\n\n{your name}\n{portfolio link}",
  placeholders: [
    { key: "{first name}", fill: "The hiring manager, not HR or a recruiter. The job post often names the team ('you'll report to our Head of Marketing'). Look that person up on the company site or LinkedIn." },
    { key: "{role title}", fill: "Use the exact title from the post. It signals you're responding to something real." },
    { key: "{specific responsibility from the post}", fill: "Pick one line from the job description that you're strong at, and paraphrase it. 'Owning the monthly newsletter and product launch emails' beats 'marketing'." },
    { key: "{specific deliverable}", fill: "A concrete chunk of work with an obvious end: 'the Q4 launch emails', 'the backlog of landing pages', 'the first month of bookkeeping close'." },
    { key: "{one relevant result}", fill: "One sentence, real and modest. 'Covered a content lead's maternity leave for a fintech, shipping two articles a week for four months.'" }
  ],
  whyItWorks: [
    "It's timely and relevant by definition: the company has publicly said it needs this exact work.",
    "It works with their plan instead of against it. You're helping them keep the work moving while they hire, not asking them to change their mind.",
    "Naming a specific deliverable makes the contract easy to picture and easy to approve from an existing budget.",
    "It goes to the hiring manager, the person feeling the pain, rather than a recruiter whose job is filling the seat with an employee."
  ],
  variations: [
    { label: "Post has been open a long time", text: "Subject: still looking for a {role title}?\n\nHi {first name},\n\nI noticed {company}'s {role title} post has been up for a while. In the meantime, I could pick up {specific deliverable} on a contract, so it's not all waiting on the hire.\n\nI've done this for {type of company} before, most recently {one relevant result}. Worth a quick chat?\n\n{your name}" },
    { label: "Offer a fractional alternative", text: "Subject: {role title}, full-time or part-time?\n\nHi {first name},\n\nSaw the {role title} opening at {company}. Reading the post, it sounds like the core need might be around {hours or scope} a week of {specific responsibility from the post}.\n\nIf that's right, a fractional setup might cover it for less than a full hire. I do exactly this for {type of company}. Happy to talk it through, even if you stick with a full-time hire.\n\n{your name}" }
  ],
  filledExample: {
    context: "A freelance email marketer sees that Fernhill Outdoor, a fictional camping gear retailer, has been advertising for an Email Marketing Manager for five weeks.",
    text: "Subject: Email Marketing Manager role, help in the meantime?\n\nHi Rachel,\n\nI saw Fernhill Outdoor is hiring an Email Marketing Manager. The post mentions owning the seasonal campaign calendar and abandoned-cart flows, which is exactly the work I do as a freelancer for outdoor and sports retailers.\n\nHiring well takes a while. If it would help, I could take on the end-of-season sale campaigns on a short contract while you find the right person, so that work doesn't stall in the meantime.\n\nA recent example: I rebuilt the cart and browse flows for a cycling accessories shop over six weeks.\n\nOpen to a 15-minute call this week to see if it's a fit?\n\nTom Achebe\ntomachebe.com"
  },
  mistakes: [
    "Applying to the job instead. If you want contract work, don't send a CV through the careers portal; it lands in the employee pipeline and gets judged against full-time candidates.",
    "Telling them they don't need to hire. Even if it's true, it questions a decision someone senior already approved.",
    "Emailing about a post that's a year old or already filled. Check the date and whether it's still on their careers page.",
    "Being vague about scope. 'I can help with marketing' gives them nothing to approve. Name the deliverable."
  ],
  followUp: "Job-post leads go stale faster than most, so follow up sooner: three or four working days is fine. Keep it to two sentences and add one useful thing, such as a quick idea for the first deliverable you mentioned. If the post comes down, send one last short note: 'Looks like the role's been filled, congratulations. If the new person ever needs overflow help, I'm around.' That message gets surprisingly warm replies and keeps the door open. In [FindMyClients](/) you can search specifically for companies hiring the role you cover.",
  related: {
    guides: ["job-posts-as-leads", "buying-signals", "find-business-contact-details"],
    templates: ["cold-email-funding-signal", "follow-up-email", "linkedin-message-after-connecting"],
    professions: ["copywriters", "web-developers", "bookkeepers"]
  }
};
