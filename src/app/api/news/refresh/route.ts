import { getRedis, REDIS_KEYS, RATE_LIMIT_TTL } from "@/lib/redis";
import { runRefresh } from "@/lib/refreshNews";

export const runtime = "nodejs";
export const maxDuration = 120;

function getClientIp(req: Request): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    req.headers.get("x-real-ip") ??
    "unknown"
  );
}

export async function POST(req: Request) {
  const ip = getClientIp(req);
  const ipKey = REDIS_KEYS.ipPrefix + ip;

  const lastRefresh = await getRedis().get<number>(ipKey);
  if (lastRefresh) {
    const elapsed = Date.now() - lastRefresh;
    const remaining = RATE_LIMIT_TTL * 1000 - elapsed;
    const hours = Math.floor(remaining / 3600000);
    const minutes = Math.floor((remaining % 3600000) / 60000);
    return Response.json({ error: "rate_limited", hours, minutes }, { status: 429 });
  }

  try {
    const dailyNews = await runRefresh();
    await getRedis().set(ipKey, Date.now(), { ex: RATE_LIMIT_TTL });
    return Response.json(dailyNews);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[news/refresh] FAILED:", message);
    return Response.json({ error: "refresh_failed", detail: message }, { status: 500 });
  }
}
