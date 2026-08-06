import type { Context, Next } from 'hono';
import { errorResponse } from '../utils/response';

interface RateLimitStore {
  count: number;
  resetTime: number;
}

const stores = new Map<string, RateLimitStore>();

export function createRateLimiter(options: { windowMs: number; max: number; message?: string }) {
  const { windowMs, max, message = 'Terlalu banyak permintaan. Silakan coba beberapa saat lagi.' } = options;

  return async function rateLimiter(c: Context, next: Next) {
    const ip = c.req.header('x-forwarded-for') || c.req.header('cf-connecting-ip') || '127.0.0.1';
    const key = `${c.req.path}:${ip}`;
    const now = Date.now();

    const record = stores.get(key);

    if (!record || now > record.resetTime) {
      stores.set(key, {
        count: 1,
        resetTime: now + windowMs
      });
      await next();
      return;
    }

    if (record.count >= max) {
      return errorResponse(c, 'RATE_LIMITED', message, undefined, 429);
    }

    record.count += 1;
    await next();
  };
}
