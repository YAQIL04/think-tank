import { createOpenAI } from "@ai-sdk/openai";
import { generateText } from "ai";

export const runtime = "nodejs";
export const maxDuration = 30;

function deepseek() {
  return createOpenAI({
    apiKey: process.env.DEEPSEEK_API_KEY_NEWS,
    baseURL: "https://api.deepseek.com/v1",
  })("deepseek-chat");
}

export async function POST(req: Request) {
  const { texts } = await req.json() as { texts: string[] };

  if (!Array.isArray(texts) || texts.length === 0) {
    return Response.json({ translations: [] });
  }

  const { text } = await generateText({
    model: deepseek(),
    prompt: `Translate the following JSON array of English strings to Chinese.
Return ONLY a valid JSON array of the same length, in the same order.

${JSON.stringify(texts)}`.trim(),
  });

  const cleaned = text.replace(/```json|```/g, "").trim();
  const translations: string[] = JSON.parse(cleaned);
  return Response.json({ translations });
}
