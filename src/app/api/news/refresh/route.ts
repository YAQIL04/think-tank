import { getRedis, REDIS_KEYS, RATE_LIMIT_TTL } from "@/lib/redis";
import { characters } from "@/config/characters";
import type { DailyNews, NewsArticle, ExpertComment } from "@/lib/types";
import { createOpenAI } from "@ai-sdk/openai";
import { generateText } from "ai";

export const runtime = "nodejs";
export const maxDuration = 120;

// ── helpers ──────────────────────────────────────────────────────────────────

function getClientIp(req: Request): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    req.headers.get("x-real-ip") ??
    "unknown"
  );
}

function deepseek() {
  return createOpenAI({
    apiKey: process.env.DEEPSEEK_API_KEY_NEWS,
    baseURL: "https://api.deepseek.com/v1",
  })("deepseek-chat");
}

// ── Step 1: fetch raw news ───────────────────────────────────────────────────

async function fetchRawNews(): Promise<string> {
  const url = new URL("https://newsapi.org/v2/top-headlines");
  url.searchParams.set("language", "en");
  url.searchParams.set("pageSize", "20");
  url.searchParams.set("apiKey", process.env.NEWSAPI_KEY!);

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`NewsAPI error: ${res.status}`);
  const json = await res.json();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const articles = (json.articles as any[]).slice(0, 20).map((a) => ({
    title: a.title,
    description: a.description,
    url: a.url,
    source: a.source?.name,
    publishedAt: a.publishedAt,
  }));

  return JSON.stringify(articles);
}

// ── Step 2: select top 5, generate bilingual title + summary ─────────────────

async function selectTop5(
  rawNews: string
): Promise<Omit<NewsArticle, "expert_comments">[]> {
  const { text } = await generateText({
    model: deepseek(),
    prompt: `
You are a world-class news editor. From the following news articles, select the 5 most globally significant stories of today.

Return ONLY a valid JSON array (no markdown, no extra text) with exactly 5 objects, each with:
- title: { en: string, zh: string }   (en = clear English headline, zh = Chinese translation)
- summary: { en: string, zh: string } (en = under 80 words neutral summary, zh = Chinese translation under 100 chars)
- source_url: string
- source_name: string
- published_at: string (ISO format)

News articles:
${rawNews}
    `.trim(),
  });

  const cleaned = text.replace(/```json|```/g, "").trim();
  return JSON.parse(cleaned);
}

// ── Step 3: generate bilingual expert comment ────────────────────────────────

async function generateExpertComment(
  article: Omit<NewsArticle, "expert_comments">,
  expertId: string,
  expertName: string
): Promise<ExpertComment> {
  const { text } = await generateText({
    model: deepseek(),
    prompt: `
You are ${expertName}. A major news story has just broken:

Title: ${article.title.en}
Summary: ${article.summary.en}

Give your authentic, in-character reaction in 2-3 sentences.
Use your signature thinking style. Be direct, insightful, and specific.
Do NOT start with "As ${expertName}...".

Return ONLY a valid JSON object (no markdown) with:
{ "en": "your comment in English", "zh": "same comment translated to Chinese" }
    `.trim(),
  });

  const cleaned = text.replace(/```json|```/g, "").trim();
  const parsed = JSON.parse(cleaned);
  return {
    expert_id: expertId,
    expert_name: expertName,
    comment: { en: parsed.en, zh: parsed.zh },
  };
}

// ── Main handler ──────────────────────────────────────────────────────────────

export async function POST(req: Request) {
  const ip = getClientIp(req);
  const ipKey = REDIS_KEYS.ipPrefix + ip;

  // --- IP rate limit check ---
  const lastRefresh = await getRedis().get<number>(ipKey);
  if (lastRefresh) {
    const elapsed = Date.now() - lastRefresh;
    const remaining = RATE_LIMIT_TTL * 1000 - elapsed;
    const hours = Math.floor(remaining / 3600000);
    const minutes = Math.floor((remaining % 3600000) / 60000);
    return Response.json(
      { error: "rate_limited", hours, minutes },
      { status: 429 }
    );
  }

  try {
    console.log("[news/refresh] Step 1: fetching raw news...");
    const rawNews = await fetchRawNews();
    console.log("[news/refresh] Step 1 OK, length:", rawNews.length);

    console.log("[news/refresh] Step 2: selecting top 5 with bilingual content...");
    const top5 = await selectTop5(rawNews);
    console.log("[news/refresh] Step 2 OK, count:", top5.length);

    console.log("[news/refresh] Step 3: generating bilingual expert comments...");
    const experts = characters.map((c) => ({ id: c.id, name: c.name }));

    const articles: NewsArticle[] = await Promise.all(
      top5.map(async (article) => {
        const comments = await Promise.all(
          experts.map((e) => generateExpertComment(article, e.id, e.name))
        );
        return { ...article, expert_comments: comments };
      })
    );

    const dailyNews: DailyNews = {
      articles,
      last_updated: new Date().toISOString(),
    };

    await getRedis().set(REDIS_KEYS.dailyNews, dailyNews, { ex: 60 * 60 * 48 });
    await getRedis().set(ipKey, Date.now(), { ex: RATE_LIMIT_TTL });

    console.log("[news/refresh] Done.");
    return Response.json(dailyNews);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[news/refresh] FAILED:", message);
    return Response.json({ error: "refresh_failed", detail: message }, { status: 500 });
  }
}
