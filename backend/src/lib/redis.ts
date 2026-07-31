import { Redis } from "ioredis";
import { logger } from "./logger.js";

type CacheValue = { value: string; expiresAt: number };

const memoryCache = new Map<string, CacheValue>();

const redis = process.env.REDIS_URL
  ? new Redis(process.env.REDIS_URL, {
      lazyConnect: true,
      maxRetriesPerRequest: 1,
      enableOfflineQueue: false,
    })
  : null;

async function getRedis() {
  if (!redis) return null;
  if (redis.status === "ready") return redis;

  try {
    await redis.connect();
    return redis;
  } catch (error) {
    logger.warn("Redis unavailable; using in-memory cache", { error: error instanceof Error ? error.message : error });
    return null;
  }
}

export async function cacheGet<T>(key: string): Promise<T | null> {
  const now = Date.now();
  const cached = memoryCache.get(key);
  if (cached && cached.expiresAt > now) {
    return JSON.parse(cached.value) as T;
  }

  const client = await getRedis();
  if (!client) return null;

  try {
    const value = await client.get(key);
    return value ? (JSON.parse(value) as T) : null;
  } catch (error) {
    logger.warn("Redis get failed", { key, error: error instanceof Error ? error.message : error });
    return null;
  }
}

export async function cacheSet<T>(key: string, value: T, ttlSeconds: number) {
  const serialized = JSON.stringify(value);
  memoryCache.set(key, { value: serialized, expiresAt: Date.now() + ttlSeconds * 1000 });

  const client = await getRedis();
  if (!client) return;

  try {
    await client.set(key, serialized, "EX", ttlSeconds);
  } catch (error) {
    logger.warn("Redis set failed", { key, error: error instanceof Error ? error.message : error });
  }
}
