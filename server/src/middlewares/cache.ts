import type { Context, Next } from 'hono';
import { cacheService } from '../services/cache.service';

export function httpCache(ttlSeconds = 900, keyPrefix = 'cache:http') {
  return async function cacheMiddleware(c: Context, next: Next) {
    if (c.req.method !== 'GET') {
      await next();
      return;
    }

    const lang = c.get('lang') || 'id';
    const cacheKey = `${keyPrefix}:${c.req.url}:lang:${lang}`;

    const cached = await cacheService.get<any>(cacheKey);
    if (cached) {
      c.header('X-Cache', 'HIT');
      return c.json(cached);
    }

    await next();

    if (c.res.status === 200) {
      try {
        const data = await c.res.clone().json();
        await cacheService.set(cacheKey, data, ttlSeconds);
        c.header('X-Cache', 'MISS');
      } catch (err) {
        // Ignore json parse error if response body is not json
      }
    }
  };
}
