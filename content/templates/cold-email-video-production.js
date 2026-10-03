export default {
  slug: "cold-email-video-production",
  title: "Cold email template: video production and editing pitch",
  metaTitle: "Video Production Cold Email Template for Freelancers",
  description: "A cold email template for videographers and editors that points to one video moment the prospect is missing or underusing. With variations and a full example.",
  channel: "Email",
  useCase: "Send this when a business already publishes video (or clearly should) and you can point to a specific gap: long uncut webinars, no product demos, a YouTube channel that stopped, or great raw material with weak editing.",
  intro: [
    "Video pitches tend to be the vaguest cold emails around: 'Video is the future of marketing, let's create engaging content together.' Nobody can say yes to that because there's nothing concrete to agree to. Good video outreach points to a specific moment: a recording they already have, a product that's hard to explain in text, or a channel that went quiet.",
    "The easiest win is repurposing. Lots of companies record webinars, podcasts, talks or events and then post a single 60-minute file. You can show them how one recording becomes a handful of short clips without filming anything new. It's a low-risk first project for them, and it demonstrates your editing quickly. If they need fresh footage later, you're already the person they trust."
  ],
  template: "Subject: clips from {company}'s {recording name}\n\nHi {first name},\n\nI watched {company}'s {recording name} on {platform}. Around {timestamp}, {speaker} explains {specific moment}, which on its own would make a strong short clip, but it's buried {how deep} into a long video.\n\nI edit video for {type of business}, mostly turning long recordings into short pieces for {where they'd post}. From that one recording I'd guess there are four or five usable clips.\n\nWant me to cut one as a sample so you can see how it looks?\n\n{your name}\n{showreel link}",
  placeholders: [
    { key: "{recording name}", fill: "The webinar, podcast episode or talk title. Use the actual title so they know which file you mean." },
    { key: "{platform}", fill: "YouTube, their website, LinkedIn, wherever you saw it." },
    { key: "{timestamp}", fill: "The minute mark, like '23:40'. This is the single most convincing detail in the email: it proves you watched." },
    { key: "{speaker} / {specific moment}", fill: "Who said what, briefly: 'your CTO explains why migrations fail on a Friday'. Choose a moment with a clear point or a bit of emotion." },
    { key: "{how deep}", fill: "'40 minutes', 'past the hour mark'. It quietly makes the case that almost nobody reached it." },
    { key: "{where they'd post}", fill: "Match their active channels: LinkedIn, Instagram Reels, YouTube Shorts, their blog." }
  ],
  whyItWorks: [
    "The timestamp is unfakeable proof of effort, and it flatters the speaker, who is often the person reading.",
    "Repurposing uses footage they already paid for, so the project feels like found value rather than new spend.",
    "A single sample clip is a small, safe yes, and it does the selling better than any description.",
    "It avoids the vague 'video strategy' pitch and talks about one recording."
  ],
  variations: [
    { label: "No video yet (product demo angle)", text: "Subject: a 60-second demo for {product}\n\nHi {first name},\n\nI was reading about {product} on {company}'s site. It took me three paragraphs to understand how {key feature} works. A 60-second screen demo would explain it in one go.\n\nI make short product videos for {type of business}. Happy to outline a script for it, free. Interested?\n\n{your name}" },
    { label: "Channel went quiet", text: "Subject: {company}'s YouTube channel\n\nHi {first name},\n\nYour channel had a strong run of {video type} videos until {month}, and the {video title} one still gets comments. It looks like posting stopped, which usually happens when editing becomes the bottleneck.\n\nI edit for {type of business} on a monthly basis, so the team only has to film. Worth a chat?\n\n{your name}" }
  ],
  filledExample: {
    context: "A freelance video editor watches a webinar recording posted by Pinecrest Analytics, a fictional data software firm, and spots a strong moment buried deep in it.",
    text: "Subject: clips from Pinecrest Analytics' 'Dashboards Nobody Reads' webinar\n\nHi Noor,\n\nI watched Pinecrest Analytics' 'Dashboards Nobody Reads' webinar on YouTube. Around 31:15, your head of product explains why most teams track twenty metrics and act on two, which on its own would make a strong short clip, but it's buried half an hour into a long video.\n\nI edit video for B2B software companies, mostly turning long recordings into short pieces for LinkedIn. From that one recording I'd guess there are four or five usable clips.\n\nWant me to cut one as a sample so you can see how it looks?\n\nRavi Desai\nravidesai.video"
  },
  mistakes: [
    "Sending a generic showreel link with no reference to their content. It asks them to imagine the fit instead of showing it.",
    "Using their footage publicly as a sample without permission. Send it privately and ask before posting it anywhere.",
    "Pitching expensive shoots first. Travel, crew and location costs make the first yes much harder than an editing job.",
    "Ignoring their brand style. If their videos are calm and plain, a sample full of flashy transitions shows you didn't look."
  ],
  followUp: "If there's no reply after a week, actually cut the sample clip and send it privately as an unlisted link with a two-line note. Keep it short, captioned and under about a minute. A finished clip of their own content is far harder to ignore than another email, and it often gets forwarded to whoever runs their social channels. If even that gets no response, leave it there; a second unanswered sample isn't worth your time. [FindMyClients](/) can help you find companies that recently ran events or webinars in your niche.",
  related: {
    guides: ["cold-email-that-gets-replies", "buying-signals", "follow-up-emails"],
    templates: ["cold-email-social-media", "cold-email-copywriting", "follow-up-email"],
    professions: ["video-editors", "social-media-managers"]
  }
};
