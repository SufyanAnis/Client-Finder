// Tells IndexNow search engines (Bing — which powers ChatGPT search and Copilot —
// plus Yandex, Seznam, Naver…) that the site's URLs changed, so they recrawl now
// instead of whenever. Run after a production deploy: `npm run indexnow`.
// Optional: `npm run indexnow -- https://findmyclients.vercel.app/blog/some-post` for specific URLs.

const SITE = (process.env.NEXT_PUBLIC_SITE_URL || "https://findmyclients.vercel.app").replace(/\/$/, "");
const KEY = "0f415071553827608445e53869af3b5b"; // public/<KEY>.txt must contain the same value

const host = new URL(SITE).host;
let urls = process.argv.slice(2);
if (!urls.length) {
  const xml = await (await fetch(`${SITE}/sitemap.xml`)).text();
  urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
}

const res = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "content-type": "application/json; charset=utf-8" },
  body: JSON.stringify({ host, key: KEY, keyLocation: `${SITE}/${KEY}.txt`, urlList: urls.slice(0, 10000) }),
});
console.log(`IndexNow: submitted ${urls.length} URLs for ${host} -> HTTP ${res.status} ${res.statusText}`);
if (res.status >= 400) console.log(await res.text());
