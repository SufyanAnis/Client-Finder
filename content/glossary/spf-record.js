export default {
  slug: "spf-record",
  term: "SPF record",
  metaTitle: "What is an SPF record? Definition and example",
  description: "An SPF record is a DNS TXT record listing which servers may send email for your domain. What it does, an example record, and common mistakes freelancers make.",
  short: "An SPF record is a DNS TXT record on your domain that lists the mail servers and services authorized to send email on that domain's behalf.",
  blocks: [
    { type: "p", text: "SPF stands for Sender Policy Framework. When a receiving server gets an email, it looks up the SPF record of the domain in the envelope sender (the technical return-path address, which is often but not always the same as the visible From address) and checks whether the sending server is on the list. If it is, SPF passes. If not, the result is a fail or softfail, which counts against the message." },
    { type: "p", text: "For freelancers and small agencies, SPF is one of three basic authentication records, alongside [DKIM](/glossary/dkim) and [DMARC](/glossary/dmarc). Without them, cold emails are far more likely to land in spam, and major mailbox providers now expect senders to authenticate." },
    { type: "example", label: "Illustrative SPF record for a domain using Google Workspace", text: "Type: TXT\nHost: @\nValue: v=spf1 include:_spf.google.com ~all" },
    { type: "p", text: "In that example, **v=spf1** marks it as an SPF record, **include:** authorizes Google's mail servers, and **~all** tells receivers to treat mail from anywhere else as a softfail. A stricter **-all** means hard fail. Your email provider's help docs give the exact include value to use." },
    { type: "ul", items: [
      "**Only one SPF record per domain.** Two separate SPF TXT records cause SPF to fail. Merge them into one.",
      "**Add every service that sends as you:** your mailbox provider, plus any outreach tool, newsletter tool or invoicing system that sends from your domain.",
      "**Watch the lookup limit:** SPF allows a maximum of 10 DNS lookups. Too many includes break it.",
      "**SPF alone is not enough:** it does not cover forwarded mail well and does not protect the visible From address without DMARC alignment."
    ] },
    { type: "tip", text: "After editing DNS, wait for it to propagate, then send a test to a Gmail address and use \"Show original\" to confirm SPF: PASS. Check again whenever you add a new sending tool." }
  ],
  example: "A fictional copywriter adds a cold outreach tool but forgets to update SPF. Her test emails show SPF softfail. She adds the tool's include to her existing record, keeping a single SPF record, and the next test passes.",
  related: {
    glossary: ["dkim", "dmarc", "email-deliverability"],
    guides: ["cold-email-that-gets-replies"],
    blog: ["cold-email-deliverability", "how-many-cold-emails-per-day"],
    templates: []
  }
};
