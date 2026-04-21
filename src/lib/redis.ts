import { Redis } from "@upstash/redis";

let _redis: Redis | null = null;

export function getRedis(): Redis {
  if (!_redis) {
    _redis = new Redis({
      url: process.env.KV_REST_API_URL!,
      token: process.env.KV_REST_API_TOKEN!,
    });
  }
  return _redis;
}

// Redis key constants
export const REDIS_KEYS = {
  dailyNews: "news:daily",
  ipPrefix: "news:ip:",
} as const;

// 24 hours in seconds
export const RATE_LIMIT_TTL = 60 * 60 * 24;
