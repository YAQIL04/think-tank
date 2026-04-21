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

// ── Step 1: fetch raw news from NewsAPI ──────────────────────────────────────

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

// ── Step 2: DeepSeek selects & summarises top 5 ───────────────────────────────

async function selectTop5(rawNews: string): Promise<Omit<NewsArticle, "expert_comments">[]> {
  const { text } = await generateText({
    model: deepseek(),
    prompt: `
You are a world-class news editor. From the following news articles, select the 5 most globally significant stories of today.

Return ONLY a valid JSON array (no markdown, no extra text) with exactly 5 objects, each with:
- title: string (clear, concise headline)
- summary: string (under 100 words, neutral tone)
- source_url: string (original article URL)
- source_name: string (media outlet name)
- published_at: string (ISO format)

News articles:
${rawNews}
    `.trim(),
  });

  const cleaned = text.replace(/```json|```/g, "").trim();
  return JSON.parse(cleaned);
}

// ── Step 3: generate one expert comment ──────────────────────────────────────

async function generateExpertComment(
  article: Omit<NewsArticle, "expert_comments">,
  expertId: string,
  expertName: string
): Promise<ExpertComment> {
  const { text } = await generateText({
    model: deepseek(),
    prompt: `
You are ${expertName}. A major news story has just broken:

Title: ${article.title}
Summary: ${article.summary}

Give your authentic, in-character reaction to this news in 2-3 sentences.
Use your signature thinking style and vocabulary. Be direct, insightful, and specific.
Do NOT start with "As ${expertName}..." — just speak directly.
    `.trim(),
  });

  return { expert_id: expertId, expert_name: expertName, comment: text.trim() };
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
    // Step 1: fetch raw news
    const rawNews = await fetchRawNews();

    // Step 2: select & summarise top 5
    const top5 = await selectTop5(rawNews);

    // Step 3: generate expert comments in parallel per article
    const experts = characters.map((c) => ({ id: c.id, name: c.name }));

    const articles: NewsArticle[] = await Promise.all(
      top5.map(async (article) => {
        const comments = await Promise.all(
          experts.map((e) => generateExpertComment(article, e.id, e.name))
        );
        return { ...article, expert_comments: comments };
      })
    );

    // Store result in Redis (48h TTL so old data persists through the day)
    const dailyNews: DailyNews = {
      articles,
      last_updated: new Date().toISOString(),
    };
    await getRedis().set(REDIS_KEYS.dailyNews, dailyNews, { ex: 60 * 60 * 48 });

    // Record IP with 24h TTL
    await getRedis().set(ipKey, Date.now(), { ex: RATE_LIMIT_TTL });

    return Response.json(dailyNews);
  } catch (err) {
    console.error("News refresh error:", err);
    return Response.json({ error: "refresh_failed" }, { status: 500 });
  }
}
