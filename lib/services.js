// lib/services.js
// Service presets shared by the finder UI, the API prompts and the content
// pages (profession pages prefill the finder with one of these). `role` is what
// a company would be hiring for when it actually needs the service — the search
// leans on that to surface active demand rather than merely "good-fit" firms.

export const SERVICES = [
  { id: "Web development", role: "web, React or full-stack developers" },
  { id: "Web design", role: "a web designer or website redesign" },
  { id: "Mobile app development", role: "mobile, iOS or Android developers" },
  { id: "SEO", role: "an SEO specialist or SEO agency" },
  { id: "Graphic design & branding", role: "a graphic designer or brand designer" },
  { id: "Copywriting & content", role: "a copywriter or content writer" },
  { id: "Video editing & production", role: "a video editor or video producer" },
  { id: "Social media management", role: "a social media manager" },
  { id: "UX/UI design", role: "UX, UI or product designers" },
  { id: "Marketing agency services", role: "a marketing manager or marketing agency" },
  { id: "Bookkeeping & accounting", role: "a bookkeeper or part-time accountant" },
  { id: "AI & automation", role: "AI engineers or automation specialists" },
];

export const SERVICE_IDS = SERVICES.map((s) => s.id);

export function roleFor(service) {
  const hit = SERVICES.find((s) => s.id.toLowerCase() === String(service || "").toLowerCase());
  return hit ? hit.role : `${service} help`;
}

export const GEOS = [
  "United States", "United Kingdom", "Canada", "Australia", "Ireland",
  "Germany", "UAE", "Saudi Arabia", "Pakistan", "India",
];

export const SIZES = ["Startup (1-50)", "Mid-market (51-500)", "Enterprise (500+)"];
