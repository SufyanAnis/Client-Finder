// lib/notify.js
// Emails an inbound service request to Swift Labs via Web3Forms (free, no SMTP).
// The destination inbox is whatever email the WEB3FORMS_ACCESS_KEY was created
// with at https://web3forms.com — set it there, not in code.

const WEB3FORMS_URL = "https://api.web3forms.com/submit";

export function emailAvailable() {
  return !!process.env.WEB3FORMS_ACCESS_KEY;
}

export async function sendRequestEmail(r) {
  const access_key = process.env.WEB3FORMS_ACCESS_KEY;
  if (!access_key) return { ok: false, error: "email not configured" };

  const res = await fetch(WEB3FORMS_URL, {
    method: "POST",
    headers: { "content-type": "application/json", accept: "application/json" },
    body: JSON.stringify({
      access_key,
      subject: `New service request: ${r.service || "general"} — ${r.name}`,
      from_name: "Swift Labs — Lead Finder",
      replyto: r.email,
      // Web3Forms emails every field below to the registered inbox:
      Name: r.name,
      Company: r.company || "—",
      Email: r.email,
      Phone: r.phone || "—",
      "Service wanted": r.service || "—",
      Message: r.message || "—",
    }),
  });
  if (!res.ok) {
    const detail = (await res.text()).slice(0, 300);
    return { ok: false, error: "Web3Forms error " + res.status, detail };
  }
  return { ok: true };
}
