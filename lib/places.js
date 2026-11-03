// lib/places.js — local businesses from map data, through official APIs only.
// (Scraping Google Maps breaks Google's terms and gets cloud IPs blocked; the
// public OpenStreetMap Overpass servers refuse/timeout from Vercel.)
//
// Provider, picked by which key is set:
//   GOOGLE_PLACES_API_KEY → Google Places API (New) Text Search — the real Maps data,
//                           ratings and review counts; needs a Google Cloud billing account.
//   GEOAPIFY_API_KEY      → Geoapify Places (OpenStreetMap data) — free plan, no card.
//
// Each result: { name, address, phone, website, email, rating, reviews, url, source }

const UA = { "user-agent": "FindMyClients/1.0 (+https://findmyclients.vercel.app)" };

export function placesProvider() {
  if (process.env.GOOGLE_PLACES_API_KEY) return "google";
  if (process.env.GEOAPIFY_API_KEY) return "geoapify";
  return null;
}

// Business types offered in the finder. `geo` = Geoapify category ids.
export const BUSINESS_TYPES = [
  { id: "dentists", label: "Dentists", geo: "healthcare.dentist" },
  { id: "clinics", label: "Clinics & doctors", geo: "healthcare.clinic_or_praxis" },
  { id: "restaurants", label: "Restaurants", geo: "catering.restaurant" },
  { id: "cafes", label: "Cafés", geo: "catering.cafe" },
  { id: "gyms", label: "Gyms & fitness", geo: "sport.fitness" },
  { id: "salons", label: "Salons & beauty", geo: "service.beauty" },
  { id: "real-estate", label: "Real estate agents", geo: "office.estate_agent" },
  { id: "lawyers", label: "Lawyers", geo: "office.lawyer" },
  { id: "accountants", label: "Accountants", geo: "office.accountant" },
  { id: "hotels", label: "Hotels", geo: "accommodation.hotel" },
  { id: "car-repair", label: "Car repair & garages", geo: "service.vehicle.repair" },
  { id: "schools", label: "Schools & academies", geo: "education.school" },
  { id: "pharmacies", label: "Pharmacies", geo: "healthcare.pharmacy" },
  { id: "shops", label: "Shops & retail", geo: "commercial" },
];

export const findType = (q) => {
  const t = String(q || "").toLowerCase().trim();
  return BUSINESS_TYPES.find((b) => b.id === t || b.label.toLowerCase() === t) ||
    BUSINESS_TYPES.find((b) => b.label.toLowerCase().includes(t) || t.includes(b.id.replace("-", " ")));
};

async function getJson(url, init = {}) {
  const res = await fetch(url, { ...init, headers: { ...UA, ...(init.headers || {}) }, cache: "no-store", signal: AbortSignal.timeout(20000) });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.error?.message || data?.message || `HTTP ${res.status}`);
  return data;
}

// ---- Google Places API (New) ------------------------------------------------------
async function googlePlaces({ query, city, limit }) {
  const data = await getJson("https://places.googleapis.com/v1/places:searchText", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "X-Goog-Api-Key": process.env.GOOGLE_PLACES_API_KEY,
      "X-Goog-FieldMask": "places.displayName,places.formattedAddress,places.nationalPhoneNumber,places.internationalPhoneNumber,places.websiteUri,places.rating,places.userRatingCount,places.googleMapsUri,places.businessStatus",
    },
    body: JSON.stringify({ textQuery: `${query} in ${city}`, pageSize: Math.min(limit, 20) }),
  });
  return (data.places || [])
    .filter((p) => p.businessStatus !== "CLOSED_PERMANENTLY")
    .map((p) => ({
      name: p.displayName?.text || "",
      address: p.formattedAddress || "",
      phone: p.internationalPhoneNumber || p.nationalPhoneNumber || "",
      website: p.websiteUri || "",
      email: "",
      rating: p.rating || null,
      reviews: p.userRatingCount || 0,
      url: p.googleMapsUri || "",
      source: "Google Maps",
    }));
}

// ---- Geoapify (OpenStreetMap data) ------------------------------------------------
async function geoapifyPlaces({ type, city, limit }) {
  const key = process.env.GEOAPIFY_API_KEY;
  const geo = await getJson(`https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(city)}&limit=1&apiKey=${key}`);
  const place = geo.features?.[0]?.properties;
  if (!place) throw new Error(`Couldn't find "${city}" on the map — try the city name only.`);
  // Inside the city's boundary when Geoapify knows it, otherwise a 10 km circle.
  const filter = place.place_id ? `place:${place.place_id}` : `circle:${place.lon},${place.lat},10000`;
  const data = await getJson(`https://api.geoapify.com/v2/places?categories=${type.geo}&filter=${filter}&limit=${Math.min(limit * 2, 60)}&apiKey=${key}`);
  return (data.features || [])
    .map((f) => {
      const p = f.properties || {};
      const raw = p.datasource?.raw || {};
      return {
        name: p.name || raw.name || "",
        address: p.formatted || p.address_line2 || "",
        phone: p.contact?.phone || raw.phone || raw["contact:phone"] || "",
        website: p.website || raw.website || raw["contact:website"] || "",
        email: p.contact?.email || raw.email || raw["contact:email"] || "",
        rating: null,
        reviews: 0,
        url: raw.osm_id ? `https://www.openstreetmap.org/${raw.osm_type === "w" ? "way" : raw.osm_type === "r" ? "relation" : "node"}/${raw.osm_id}` : "",
        source: "OpenStreetMap via Geoapify",
      };
    })
    .filter((b) => b.name);
}

export async function searchPlaces({ type, query, city, limit = 20 }) {
  const provider = placesProvider();
  if (!provider) throw new Error("Map search isn't set up on the server yet.");
  if (provider === "google") return googlePlaces({ query: query || type?.label, city, limit });
  if (!type) throw new Error("Pick a business type from the list.");
  return geoapifyPlaces({ type, city, limit });
}
