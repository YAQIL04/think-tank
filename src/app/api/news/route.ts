import { getRedis, REDIS_KEYS } from "@/lib/redis";
import type { DailyNews } from "@/lib/types";

export const runtime = "nodejs";

export async function GET() {
  const data = await getRedis().get<DailyNews>(REDIS_KEYS.dailyNews);
  if (!data) {
    return Response.json({ articles: [], last_updated: null });
  }
  return Response.json(data);
}
