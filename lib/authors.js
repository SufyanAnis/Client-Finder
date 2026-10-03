// lib/authors.js
// Bylines for articles (Google weighs who wrote a page; answer engines cite it).
// Edit the bio and links to match the real person — keep it truthful.

export const AUTHORS = {
  "sufyan-anis": {
    slug: "sufyan-anis",
    name: "Sufyan Anis",
    role: "Founder, Swift Labs",
    bio: "Sufyan runs Swift Labs, a small digital studio in Karachi building web, mobile and AI products for clients in the UK, Gulf and US. He built FindMyClients to automate the client-finding work the studio was doing by hand.",
    links: [
      { label: "Swift Labs", url: "https://website-portfolio-kdli.vercel.app/" },
      { label: "GitHub", url: "https://github.com/SufyanAnis" },
    ],
  },
};

export const DEFAULT_AUTHOR = AUTHORS["sufyan-anis"];
export const getAuthor = (slug) => AUTHORS[slug] || DEFAULT_AUTHOR;
