import { redis } from '../db/redis';

/** Hash string to SHA-256 hex string using Bun/Web Crypto API */
export async function hashToken(token: string): Promise<string> {
  const hasher = new Bun.CryptoHasher('sha256');
  hasher.update(token);
  return hasher.digest('hex');
}

export const cacheService = {
  /** Get item from cache */
  async get<T>(key: string): Promise<T | null> {
    try {
      const data = await redis.get(key);
      if (!data) return null;
      return JSON.parse(data) as T;
    } catch (err) {
      return null;
    }
  },

  /** Set item in cache with TTL in seconds */
  async set(key: string, value: unknown, ttlSeconds = 900): Promise<void> {
    try {
      const serialized = JSON.stringify(value);
      if (ttlSeconds > 0) {
        await redis.setex(key, ttlSeconds, serialized);
      } else {
        await redis.set(key, serialized);
      }
    } catch (err) {
      // Ignore cache write errors if Redis is down
    }
  },

  /** Delete single key from cache */
  async del(key: string): Promise<void> {
    try {
      await redis.del(key);
    } catch (err) {
      // Ignore
    }
  },

  async delete(key: string): Promise<void> {
    await this.del(key);
  },

  /** Invalidate all keys matching pattern (e.g. "cache:posts:*") using SCAN */
  async invalidatePattern(pattern: string): Promise<void> {
    try {
      let stream = redis.scanStream({
        match: pattern,
        count: 100
      });

      stream.on('data', async (resultKeys: string[]) => {
        if (resultKeys.length > 0) {
          const pipeline = redis.pipeline();
          resultKeys.forEach((key) => pipeline.del(key));
          await pipeline.exec();
        }
      });
    } catch (err) {
      // Ignore
    }
  },

  /** Blacklist an Access Token on Logout (TTL default 15m = 900s) */
  async blacklistToken(token: string, ttlSeconds = 900): Promise<void> {
    try {
      const hashed = await hashToken(token);
      const key = `blacklist:token:${hashed}`;
      await redis.setex(key, ttlSeconds, '1');
    } catch (err) {
      // Ignore
    }
  },

  /** Check if Access Token is blacklisted */
  async isTokenBlacklisted(token: string): Promise<boolean> {
    try {
      const hashed = await hashToken(token);
      const key = `blacklist:token:${hashed}`;
      const exists = await redis.exists(key);
      return exists === 1;
    } catch (err) {
      return false;
    }
  }
};
