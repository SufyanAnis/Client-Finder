// lib/enrich.js
// Best-effort public contact lookup: search the web for a company's contact
// page and extract a generic email / main phone / LinkedIn company URL.
// Strictly extractive — the model may use only details that literally appear in
// the results, never guess. Returns leads unchanged if anything fails.

import { generate } from "./llm";
import { searchAvailable, webSearch } from "./search";

const str = (v) => (typeof v === "string" ? v : "");

export async function enrichContacts(leads) {
  if (!searchAvailable()) return leads;
  const needing = leads.filter((l) => !l.email || !l.phone);
  if (!needing.length) return leads;

  try {
    const searched = await Promise.all(
      needing.map((l) =>
        webSearch(`${l.company} ${l.website || ""} ${l.location || ""} contact email phone`, 5)
          .then((results) => ({ company: l.company, results }))
          .catch(() => ({ company: l.company, results: [] }))
      )
    );
    const ctx = searched
      .filter((s) => s.results.length)
      .map((s) => `## ${s.company}\n` + s.results.map((r) => `${r.title}\n${r.url}\n${r.content}`).join("\n---\n"))
      .join("\n\n");
    if (!ctx) return leads;

    const prompt =
`From the web search results below, extract PUBLIC company contact details for each company. Use ONLY details that literally appear in the results — never guess or invent an email, phone, or LinkedIn URL. Prefer a generic company email (info@/hello@/contact@) and a main business phone number (with country code if shown). Never return personal or home details. If a detail isn't present, use an empty string.
Return ONLY a valid JSON array, one object per company, no markdown:
[{"company":string,"email":string,"phone":string,"linkedin":string}]

${ctx}`;

    const enr = await generate({ prompt, maxTokens: 1200, webSearch: false, fast: true });
    if (!enr.ok || enr.stop !== "ok") return leads;
    const a = enr.text.indexOf("["), b = enr.text.lastIndexOf("]");
    if (a === -1 || b === -1) return leads;
    let contacts;
    try { contacts = JSON.parse(enr.text.slice(a, b + 1)); } catch { return leads; }
    if (!Array.isArray(contacts)) return leads;

    const byName = new Map(contacts.filter((c) => c && c.company).map((c) => [String(c.company).toLowerCase(), c]));
    return leads.map((l) => {
      const c = byName.get(l.company.toLowerCase());
      if (!c) return l;
      return {
        ...l,
        email: l.email || str(c.email),
        phone: l.phone || str(c.phone),
        linkedin: l.linkedin || str(c.linkedin),
      };
    });
  } catch {
    return leads;
  }
}
