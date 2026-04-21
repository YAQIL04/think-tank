import { Redis } from "@upstash/redis";

let _redis: Redis | null = null;

export function getRedis(): Redis {
  if (!_redis) {
    _redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL!,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
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
