// lib/llm.js
// Provider-agnostic text generation for the server routes. Picks a provider by
// which key is set, in this order:
//   ANTHROPIC_API_KEY -> Anthropic (paid, native web_search)
//   GEMINI_API_KEY    -> Gemini   (free tier where available, google_search)
//   GROQ_API_KEY      -> Groq     (free, NO native search — pair with Tavily)
// Anthropic/Gemini search the web themselves. Groq can't, so the find-leads
// route runs a Tavily search first (see lib/search.js) and feeds the results in.

const ANTHROPIC_URL = "https://api.anthropic.com/v1/messages";
const ANTHROPIC_MODEL = process.env.ANTHROPIC_MODEL || "claude-sonnet-4-6";

const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-2.0-flash";
const geminiUrl = (model) =>
  `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_MODEL = process.env.GROQ_MODEL || "llama-3.3-70b-versatile";
// Cheaper, higher-quota model for short jobs (drafts, contact extraction) and as
// the fallback when the main model hits its free-tier limit.
const GROQ_FAST_MODEL = process.env.GROQ_FAST_MODEL || "llama-3.1-8b-instant";

export const MISSING_KEY_MESSAGE =
  "Server has no AI key set. Add GROQ_API_KEY (free, console.groq.com), or ANTHROPIC_API_KEY (paid), or GEMINI_API_KEY.";

export function activeProvider() {
  if (process.env.ANTHROPIC_API_KEY) return "anthropic";
  if (process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY) return "gemini";
  if (process.env.GROQ_API_KEY) return "groq";
  return null;
}

// Anthropic and Gemini search the web themselves; Groq needs an external search.
export function providerHasNativeSearch(provider = activeProvider()) {
  return provider === "anthropic" || provider === "gemini";
}

// Returns one of:
//   { ok: true, text, stop }            stop: "ok" | "max_tokens" | "refusal"
//   { ok: false, status, error, detail? }
// `fast` asks for the provider's cheaper model where one is configured (Groq).
export async function generate({ prompt, maxTokens, webSearch = false, fast = false }) {
  const provider = activeProvider();
  if (!provider) return { ok: false, status: 500, error: MISSING_KEY_MESSAGE };
  if (provider === "anthropic") return anthropic({ prompt, maxTokens, webSearch });
  if (provider === "gemini") return gemini({ prompt, maxTokens, webSearch });
  return groq({ prompt, maxTokens, fast }); // Groq has no native search; webSearch ignored
}

async function anthropic({ prompt, maxTokens, webSearch }) {
  const key = process.env.ANTHROPIC_API_KEY;
  const headers = {
    "content-type": "application/json",
    "x-api-key": key,
    "anthropic-version": "2023-06-01",
  };
  const tools = webSearch
    ? [{ type: "web_search_20250305", name: "web_search", max_uses: 6 }]
    : undefined;

  let messages = [{ role: "user", content: prompt }];
  let data;
  // the server-side web_search loop can return stop_reason "pause_turn" with an
  // incomplete turn — resume by re-sending the assistant content (bounded)
  for (let turn = 0; ; turn++) {
    const res = await fetch(ANTHROPIC_URL, {
      method: "POST",
      headers,
      body: JSON.stringify({ model: ANTHROPIC_MODEL, max_tokens: maxTokens, messages, ...(tools ? { tools } : {}) }),
    });
    if (!res.ok) {
      const detail = (await res.text()).slice(0, 400);
      return { ok: false, status: 502, error: "Anthropic API error " + res.status, detail };
    }
    data = await res.json();
    if (data.stop_reason === "pause_turn" && turn < 2) {
      messages = [...messages, { role: "assistant", content: data.content }];
      continue;
    }
    break;
  }

  if (data.stop_reason === "max_tokens") return { ok: true, text: collectAnthropic(data), stop: "max_tokens" };
  if (data.stop_reason === "refusal") return { ok: true, text: "", stop: "refusal" };
  return { ok: true, text: collectAnthropic(data), stop: "ok" };
}

function collectAnthropic(data) {
  return (data.content || [])
    .filter((b) => b.type === "text")
    .map((b) => b.text)
    .join("\n")
    .trim();
}

async function gemini({ prompt, maxTokens, webSearch }) {
  const key = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  const body = {
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    generationConfig: { maxOutputTokens: maxTokens },
    ...(webSearch ? { tools: [{ google_search: {} }] } : {}),
  };
  const res = await fetch(geminiUrl(GEMINI_MODEL), {
    method: "POST",
    headers: { "content-type": "application/json", "x-goog-api-key": key },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const detail = (await res.text()).slice(0, 400);
    return { ok: false, status: 502, error: "Gemini API error " + res.status, detail };
  }
  const data = await res.json();
  if (data.promptFeedback?.blockReason) return { ok: true, text: "", stop: "refusal" };
  const cand = (data.candidates || [])[0];
  if (!cand) return { ok: true, text: "", stop: "refusal" };
  const text = (cand.content?.parts || [])
    .map((p) => p.text || "")
    .join("")
    .trim();
  const stop = cand.finishReason === "MAX_TOKENS" ? "max_tokens" : cand.finishReason === "SAFETY" ? "refusal" : "ok";
  return { ok: true, text, stop };
}

async function groq({ prompt, maxTokens, fast }) {
  const key = process.env.GROQ_API_KEY;
  const call = (model) =>
    fetch(GROQ_URL, {
      method: "POST",
      headers: { "content-type": "application/json", Authorization: `Bearer ${key}` },
      body: JSON.stringify({
        model,
        messages: [{ role: "user", content: prompt }],
        max_tokens: maxTokens,
        temperature: 0.6,
      }),
    });
  // Free-tier limits are per model, so when the main model is rate-limited (429)
  // the smaller, higher-quota model takes the request instead of failing it.
  let res = await call(fast ? GROQ_FAST_MODEL : GROQ_MODEL);
  if (res.status === 429 && !fast && GROQ_FAST_MODEL !== GROQ_MODEL) res = await call(GROQ_FAST_MODEL);
  if (!res.ok) {
    if (res.status === 429) {
      return { ok: false, status: 429, error: "The AI provider is busy right now (free-tier rate limit). Try again in a minute." };
    }
    const detail = (await res.text()).slice(0, 400);
    return { ok: false, status: 502, error: "Groq API error " + res.status, detail };
  }
  const data = await res.json();
  const choice = (data.choices || [])[0];
  const text = (choice?.message?.content || "").trim();
  const stop = choice?.finish_reason === "length" ? "max_tokens" : !text ? "refusal" : "ok";
  return { ok: true, text, stop };
}
