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

  try {
    const { text } = await generateText({
      model: deepseek(),
      prompt: `Translate each string in this JSON array from English to Chinese.
Return ONLY the JSON array with the same number of elements, same order.
Do not add any explanation or markdown.

${JSON.stringify(texts)}`,
    });

    // Extract the first [...] block regardless of surrounding text
    const match = text.match(/\[[\s\S]*\]/);
    if (!match) throw new Error(`No JSON array in response: ${text.slice(0, 200)}`);
    const translations: string[] = JSON.parse(match[0]);
    return Response.json({ translations });
  } catch (err) {
    const detail = err instanceof Error ? err.message : String(err);
    console.error("[translate] failed:", detail);
    return Response.json({ error: "translate_failed", detail }, { status: 500 });
  }
}
