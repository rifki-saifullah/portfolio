import type { Context, Next } from 'hono';
import { verifyAccessToken } from '../utils/paseto';
import { errorResponse } from '../utils/response';
import { cacheService } from '../services/cache.service';
import { getAccessTokenCookie } from '../utils/cookie';
import type { UserPayload } from '../types';

declare module 'hono' {
  interface ContextVariableMap {
    user: UserPayload;
    token: string;
    lang: string;
  }
}

export async function authMiddleware(c: Context, next: Next) {
  // Priority: Authorization header → access_token cookie
  const authHeader = c.req.header('Authorization');
  let token: string | undefined;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7);
  } else {
    token = getAccessTokenCookie(c);
  }

  if (!token) {
    return errorResponse(c, 'UNAUTHORIZED', 'Token otentikasi tidak ditemukan.', undefined, 401);
  }

  // Check if token is blacklisted in Redis
  const isBlacklisted = await cacheService.isTokenBlacklisted(token);
  if (isBlacklisted) {
    return errorResponse(c, 'UNAUTHORIZED', 'Token telah dicabut (logout). Silakan login kembali.', undefined, 401);
  }

  const payload = await verifyAccessToken(token);

  if (!payload) {
    return errorResponse(c, 'UNAUTHORIZED', 'Token tidak valid atau telah kadaluwarsa.', undefined, 401);
  }

  c.set('token', token);
  c.set('user', {
    id: payload.sub,
    name: payload.name,
    email: payload.email,
    avatarUrl: payload.avatarUrl
  });

  await next();
}
