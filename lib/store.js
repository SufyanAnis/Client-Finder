// lib/store.js
// Stores inbound service requests in Supabase (free Postgres) via its REST API,
// so they appear in the in-app inbox and export to Excel. Requires a `requests`
// table (see README for the one-line SQL). No-ops gracefully if not configured.

const SUPA_URL = process.env.SUPABASE_URL;
const SUPA_KEY = process.env.SUPABASE_SERVICE_KEY;

export function storeAvailable() {
  return !!(SUPA_URL && SUPA_KEY);
}

function headers() {
  return { apikey: SUPA_KEY, Authorization: `Bearer ${SUPA_KEY}`, "content-type": "application/json" };
}

export async function saveRequest(r) {
  if (!storeAvailable()) return { ok: false, error: "store not configured" };
  const res = await fetch(`${SUPA_URL}/rest/v1/requests`, {
    method: "POST",
    headers: { ...headers(), Prefer: "return=minimal" },
    body: JSON.stringify({
      name: r.name,
      company: r.company || "",
      email: r.email,
      phone: r.phone || "",
      service: r.service || "",
      message: r.message || "",
    }),
  });
  if (!res.ok) {
    const detail = (await res.text()).slice(0, 300);
    return { ok: false, error: "Supabase error " + res.status, detail };
  }
  return { ok: true };
}

export async function listRequests() {
  if (!storeAvailable()) return { ok: false, error: "store not configured" };
  const res = await fetch(`${SUPA_URL}/rest/v1/requests?select=*&order=created_at.desc`, { headers: headers() });
  if (!res.ok) {
    const detail = (await res.text()).slice(0, 300);
    return { ok: false, error: "Supabase error " + res.status, detail };
  }
  return { ok: true, rows: await res.json() };
}
