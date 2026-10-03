export default {
  slug: "dmarc",
  term: "DMARC",
  metaTitle: "What is a DMARC record? Definition and policies",
  description: "A DMARC record tells receivers what to do with email failing SPF and DKIM alignment, and where to send reports. Policies, an example and safe rollout.",
  short: "A DMARC record is a DNS TXT record that tells receiving servers how to handle email failing SPF and DKIM alignment checks for your domain, and where to send reports.",
  blocks: [
    { type: "p", text: "DMARC stands for Domain-based Message Authentication, Reporting and Conformance. It builds on [SPF](/glossary/spf-record) and [DKIM](/glossary/dkim). A message passes DMARC when at least one of them passes **and aligns**, meaning the domain checked by SPF or DKIM matches the domain in the visible From address. That alignment is what stops someone spoofing your From address with a server they control." },
    { type: "p", text: "The record lives at the host _dmarc on your domain and sets a policy:" },
    { type: "ul", items: [
      "**p=none:** monitor only. Receivers deliver as normal but send you reports.",
      "**p=quarantine:** failing mail should be treated as suspicious, usually sent to spam.",
      "**p=reject:** failing mail should be refused."
    ] },
    { type: "example", label: "Illustrative starter DMARC record", text: "Type: TXT\nHost: _dmarc\nValue: v=DMARC1; p=none; rua=mailto:dmarc-reports@yourdomain.com" },
    { type: "p", text: "For freelancers and small agencies, DMARC matters for two reasons. Gmail and Yahoo now require bulk senders to publish DMARC and expect all senders to authenticate, and a domain with no DMARC record looks less trustworthy. It also protects your brand: without it, anyone can send email that appears to come from your domain to your clients." },
    { type: "p", text: "A safe rollout: confirm SPF and DKIM pass for every service that sends as you, publish p=none with a reporting address, read the reports for a few weeks to spot legitimate senders you missed, then move to quarantine and later reject. Jumping straight to reject can block your own invoices or newsletter." },
    { type: "p", text: "Pitfalls: publishing more than one DMARC record, using an rua address on another domain without the needed authorization, and assuming DMARC fixes poor content or volume. It is an authentication layer for [email deliverability](/glossary/email-deliverability), not a guarantee of inbox placement." },
    { type: "tip", text: "Raw DMARC reports are XML files. A free report-reading service or your email provider's dashboard makes them readable in minutes." }
  ],
  example: "A fictional bookkeeping firm publishes p=none and finds in the reports that its invoicing app fails alignment. It sets up DKIM for that app, then moves to p=quarantine a month later.",
  related: {
    glossary: ["spf-record", "dkim", "email-deliverability"],
    guides: ["cold-email-that-gets-replies"],
    blog: ["cold-email-deliverability", "how-many-cold-emails-per-day"],
    templates: []
  }
};
