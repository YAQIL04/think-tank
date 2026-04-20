import { createOpenAI } from "@ai-sdk/openai";
import { streamText } from "ai";
import { readFileSync } from "fs";
import { join } from "path";
import { getCharacterById } from "@/config/characters";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: Request) {
  const { messages, characterId } = await req.json();

  if (!characterId) {
    return new Response("Missing characterId", { status: 400 });
  }

  const character = getCharacterById(characterId);
  if (!character) {
    return new Response("Character not found", { status: 404 });
  }

  const skillPath = join(process.cwd(), "src", "skills", character.skillFile);
  let systemPrompt: string;
  try {
    systemPrompt = readFileSync(skillPath, "utf-8");
  } catch {
    return new Response("Skill file not found", { status: 500 });
  }

  // DeepSeek 兼容 OpenAI 接口
  const deepseek = createOpenAI({
    apiKey: process.env.DEEPSEEK_API_KEY,
    baseURL: "https://api.deepseek.com/v1",
  });

  const result = await streamText({
    model: deepseek("deepseek-chat"),
    system: systemPrompt,
    messages,
  });

  return result.toDataStreamResponse();
}
