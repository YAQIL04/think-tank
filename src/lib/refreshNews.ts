import { getRedis, REDIS_KEYS } from "@/lib/redis";
import { characters } from "@/config/characters";
import type { DailyNews, NewsArticle, ExpertComment } from "@/lib/types";
import { createOpenAI } from "@ai-sdk/openai";
import { generateText } from "ai";

function deepseek() {
  return createOpenAI({
    apiKey: process.env.DEEPSEEK_API_KEY_NEWS,
    baseURL: "https://api.deepseek.com/v1",
  })("deepseek-chat");
}

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

async function selectTop5(
  rawNews: string
): Promise<Omit<NewsArticle, "expert_comments">[]> {
  const { text } = await generateText({
    model: deepseek(),
    prompt: `
You are a world-class news editor. From the following news articles, select the 5 most globally significant stories of today.

Return ONLY a valid JSON array (no markdown, no extra text) with exactly 5 objects, each with:
- title: string (clear English headline)
- summary: string (under 80 words, neutral)
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

Give your authentic, in-character reaction in 2-3 sentences.
Use your signature thinking style. Be direct, insightful, and specific.
Do NOT start with "As ${expertName}...".
Return ONLY the comment text — no JSON, no quotes, no formatting.
    `.trim(),
  });

  return { expert_id: expertId, expert_name: expertName, comment: text.trim() };
}

export async function runRefresh(): Promise<DailyNews> {
  console.log("[runRefresh] Step 1: fetching raw news...");
  const rawNews = await fetchRawNews();

  console.log("[runRefresh] Step 2: selecting top 5...");
  const top5 = await selectTop5(rawNews);

  console.log("[runRefresh] Step 3: generating expert comments...");
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
  console.log("[runRefresh] Done.");
  return dailyNews;
}
