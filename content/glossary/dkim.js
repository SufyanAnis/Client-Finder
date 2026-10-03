export default {
  slug: "dkim",
  term: "DKIM",
  metaTitle: "What is DKIM? DomainKeys Identified Mail explained",
  description: "DKIM adds a cryptographic signature to your emails so receivers can verify they came from your domain and were not altered. How it works and how to set it up.",
  short: "DKIM (DomainKeys Identified Mail) is an email authentication method that adds a cryptographic signature to messages, verified against a public key published in the sender's DNS.",
  blocks: [
    { type: "p", text: "When DKIM is enabled, your mail server signs each outgoing email with a private key. The signature goes into a message header that names your domain and a **selector**. The receiving server looks up the matching public key in DNS, at a host like selector._domainkey.yourdomain.com, and checks the signature. If it verifies, the receiver knows the signed parts of the message were not altered in transit and that the signing domain authorized it." },
    { type: "p", text: "For freelancers sending cold outreach, DKIM matters because it is one of the main signals mailbox providers use to trust your domain. It also survives most forwarding better than [SPF](/glossary/spf-record) does, and it is one of the two ways a message can pass [DMARC](/glossary/dmarc)." },
    { type: "ol", items: [
      "In your email provider's admin settings, find the DKIM or email authentication section and generate a key.",
      "Copy the DNS record it gives you (usually a TXT record, sometimes a CNAME) into your domain's DNS.",
      "Wait for DNS to update, then turn on signing in the provider's settings.",
      "Send a test email and confirm the headers show DKIM: PASS for your domain.",
      "Repeat for any other service that sends as your domain, such as an outreach or newsletter tool."
    ] },
    { type: "p", text: "Pitfalls: leaving signing on the provider's default domain instead of your own, so DKIM passes but does not align with your From address; pasting the key with broken line breaks or quotes; and forgetting third-party tools. Each sending service needs its own DKIM setup, usually with its own selector." },
    { type: "p", text: "DKIM proves the message is authentic. It does not prove the content is wanted, so good authentication will not rescue untargeted, high-volume sending. Think of it as a requirement for [email deliverability](/glossary/email-deliverability), not a shortcut." },
    { type: "tip", text: "Use 2048-bit keys if your provider offers them, and keep a note of which selector belongs to which service so you can remove old ones later." }
  ],
  example: "A fictional two-person agency, Pixel & Pine, sees DKIM pass in headers but with their outreach tool's domain listed, not theirs. They add the tool's custom DKIM record for pixelandpine.example so the signature aligns with their From address.",
  related: {
    glossary: ["spf-record", "dmarc", "email-deliverability", "email-warm-up"],
    guides: ["cold-email-that-gets-replies"],
    blog: ["cold-email-deliverability"],
    templates: []
  }
};
