// lib/plans.js — credit packs sold through Safepay. One credit = one lead search.
// Prices are in PKR. Change them here; nothing else needs editing.

export const PACKS = [
  { id: "starter", name: "Starter", credits: 10, price: 499, blurb: "Try it on a real campaign" },
  { id: "pro", name: "Pro", credits: 50, price: 1999, blurb: "A month of steady prospecting", popular: true },
  { id: "agency", name: "Agency", credits: 150, price: 4999, blurb: "For small teams and agencies" },
];

export const CURRENCY = "PKR";
export const getPack = (id) => PACKS.find((p) => p.id === id) || null;
export const perSearch = (p) => Math.round(p.price / p.credits);
export const fmtPrice = (n) => `Rs ${n.toLocaleString("en-PK")}`;

// What a key holder gets per day besides searches (these cost us little or
// nothing extra, so they're generous caps rather than metered credits).
export const PAID_DAILY = { drafts: 150, lookups: 40 };
