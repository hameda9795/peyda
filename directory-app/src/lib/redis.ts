import { Redis } from '@upstash/redis';

// Initialize Redis client
export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || '',
  token: process.env.UPSTASH_REDIS_REST_TOKEN || '',
});

// Helper function to check if Redis is configured
export const isRedisConfigured = () => {
  return !!(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN);
};

// Cache helper with fallback
export async function getCachedData<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttlSeconds: number = 300
): Promise<T> {
  // If Redis is not configured, just fetch directly
  if (!isRedisConfigured()) {
    return fetcher();
  }

  try {
    // Try to get from cache
    const cached = await redis.get<T>(key);
    if (cached) {
      console.log(`[Redis] Cache hit for key: ${key}`);
      return cached;
    }

    // Fetch fresh data
    console.log(`[Redis] Cache miss for key: ${key}`);
    const data = await fetcher();

    // Store in cache
    await redis.setex(key, ttlSeconds, data);

    return data;
  } catch (error) {
    console.error(`[Redis] Error fetching cache for key ${key}:`, error);
    // Fallback to direct fetch
    return fetcher();
  }
}

// Invalidate cache
export async function invalidateCache(key: string) {
  if (!isRedisConfigured()) return;

  try {
    await redis.del(key);
    console.log(`[Redis] Invalidated cache for key: ${key}`);
  } catch (error) {
    console.error(`[Redis] Error invalidating cache for key ${key}:`, error);
  }
}

// Invalidate cache by pattern (using scan)
export async function invalidateCachePattern(pattern: string) {
  if (!isRedisConfigured()) return;

  try {
    const keys = await redis.keys(pattern);
    if (keys.length > 0) {
      await redis.del(...keys);
      console.log(`[Redis] Invalidated ${keys.length} keys matching pattern: ${pattern}`);
    }
  } catch (error) {
    console.error(`[Redis] Error invalidating cache pattern ${pattern}:`, error);
  }
}
