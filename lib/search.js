// lib/search.js
// Free web search via Tavily (https://tavily.com) for LLM providers that have
// no native search tool (e.g. Groq). The find-leads route feeds these results
// to the model so it extracts REAL companies instead of inventing them.

const TAVILY_URL = "https://api.tavily.com/search";

export function searchAvailable() {
  return !!process.env.TAVILY_API_KEY;
}

// Returns [{ title, url, content }]. Throws on transport/API error (err.detail
// carries the upstream body).
export async function webSearch(query, maxResults = 10) {
  const key = process.env.TAVILY_API_KEY;
  if (!key) throw new Error("TAVILY_API_KEY is not set");

  const res = await fetch(TAVILY_URL, {
    method: "POST",
    headers: { "content-type": "application/json", Authorization: `Bearer ${key}` },
    body: JSON.stringify({
      query,
      max_results: maxResults,
      search_depth: "basic",
      topic: "general",
      include_answer: false,
    }),
  });
  if (!res.ok) {
    const err = new Error("Tavily search error " + res.status);
    err.detail = (await res.text()).slice(0, 300);
    throw err;
  }
  const data = await res.json();
  return (data.results || []).map((r) => ({
    title: r.title || "",
    url: r.url || "",
    content: r.content || "",
  }));
}
