export default {
  slug: "cold-email-social-media",
  title: "Cold email template: social media management pitch",
  metaTitle: "Social Media Management Cold Email Template",
  description: "A cold email template for social media managers built on what's already working on the prospect's own feed. Includes placeholders, variations and an example.",
  channel: "Email",
  useCase: "Send this when a business posts on social media inconsistently but has at least one post that clearly outperformed the rest, or when its comments and messages go unanswered.",
  intro: [
    "Most social media pitches criticize: 'your engagement is low', 'you're not posting enough'. Owners already know, and being reminded by a stranger doesn't make them want to hire that stranger. A better opening is to point at what's already working. Nearly every small business account has one or two posts that did far better than the rest, usually by accident.",
    "This template starts there. You name the post that worked, give a plain reason why, and suggest doing more of that on a regular schedule. It turns the conversation from 'you're bad at this' into 'you've already found something, let's repeat it', which is a far more pleasant thing to reply to."
  ],
  template: "Subject: that {post topic} post on {platform}\n\nHi {first name},\n\nI was scrolling {company}'s {platform} and the {post topic} post from {when} stood out. It got {rough comparison} your usual posts, I think because {reason it worked}.\n\nMost of your feed is {what the rest looks like}, which is fine, but there's clearly an appetite for more {the thing that worked}.\n\nI manage social accounts for {type of business}. I'd be happy to sketch a month of post ideas built around that, free, so you can see the approach.\n\nShall I send it?\n\n{your name}",
  placeholders: [
    { key: "{post topic}", fill: "Describe the post in a few words: 'behind-the-scenes kitchen prep', 'meet the team: Ana'." },
    { key: "{platform}", fill: "Instagram, LinkedIn, Facebook, TikTok. Pick the one where they're most active." },
    { key: "{when}", fill: "'last month', 'in March'. Only go back a few months; ancient wins feel irrelevant." },
    { key: "{rough comparison}", fill: "Keep it honest and loose: 'several times the comments of', 'far more shares than'. Don't invent precise numbers you can't see." },
    { key: "{reason it worked}", fill: "Your actual analysis: 'it showed a real person', 'it answered a question customers ask', 'it was a short video rather than a graphic'." },
    { key: "{what the rest looks like}", fill: "Neutral description: 'product photos with prices', 'shared industry articles'." }
  ],
  whyItWorks: [
    "Leading with a success is disarming. People respond warmly to someone who noticed what they did well.",
    "It shows strategic thinking (why the post worked) rather than just 'I can post for you'.",
    "The free month of ideas is useful on its own and shows your taste without a long proposal.",
    "It avoids the follower-count and engagement-rate jargon that small business owners often tune out."
  ],
  variations: [
    { label: "Unanswered comments angle", text: "Subject: comments on {company}'s {platform}\n\nHi {first name},\n\nI noticed a few recent comments on {company}'s {platform} asking {customer question}, and they haven't had a reply yet. Those are often people close to buying.\n\nI manage social accounts for {type of business}, including replying within the day. Want to hear how I'd set that up for you?\n\n{your name}" },
    { label: "Shorter version", text: "Subject: your {post topic} post\n\nHi {first name},\n\nYour {post topic} post on {platform} did far better than the rest of your feed, probably because {reason it worked}.\n\nI manage social for {type of business}. Happy to send a month of ideas built around that, free. Want them?\n\n{your name}" }
  ],
  filledExample: {
    context: "A freelance social media manager notices that Saffron Lane Kitchen, a fictional neighborhood restaurant, had one Instagram reel of a chef prepping bread that far outperformed its usual menu photos.",
    text: "Subject: that bread-prep reel on Instagram\n\nHi Leila,\n\nI was scrolling Saffron Lane Kitchen's Instagram and the reel of your chef shaping the morning flatbreads from last month stood out. It got many times the comments of your usual posts, I think because it showed a real person and a bit of process people never normally see.\n\nMost of your feed is menu photos with prices, which is fine, but there's clearly an appetite for more behind-the-scenes kitchen moments.\n\nI manage social accounts for independent restaurants and cafes. I'd be happy to sketch a month of post ideas built around that, free, so you can see the approach.\n\nShall I send it?\n\nMaya Lindqvist"
  },
  mistakes: [
    "Quoting follower counts back to them ('you only have 800 followers'). It's demoralizing and says nothing about what to do.",
    "Promising viral growth. Nobody controls that, and owners who've been burned before will stop reading.",
    "Sending a DM on the platform instead of an email when they list a business email. DMs from strangers offering services get filtered or ignored on most platforms.",
    "Pitching every platform at once. Start with the one where they already have traction."
  ],
  followUp: "After about a week, follow up by sending three of the post ideas you promised, written out properly with a caption draft for one. It's a small amount of work and makes your offer tangible. If you've noticed a new post of theirs in the meantime, mention it briefly. If there's still nothing after that, stop; you can always try again in a few months if their posting pattern changes. When building your list, [FindMyClients](/) can turn up local businesses with active but irregular accounts in your target niche.",
  related: {
    guides: ["cold-email-that-gets-replies", "ideal-client-profile", "follow-up-emails"],
    templates: ["cold-email-video-production", "cold-email-copywriting", "follow-up-email"],
    professions: ["social-media-managers", "marketing-agencies"]
  }
};
