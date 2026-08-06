import { setCookie, deleteCookie, getCookie } from 'hono/cookie';
import type { Context } from 'hono';
import { config } from '../config';

const REFRESH_COOKIE_NAME = 'refresh_token';
const ACCESS_COOKIE_NAME = 'access_token';

// ─── Refresh Token Cookie (long-lived, 7d) ────────────────────────────────────

export function setRefreshTokenCookie(c: Context, refreshToken: string) {
  const maxAgeSeconds = config.REFRESH_TOKEN_EXPIRES_DAYS * 24 * 60 * 60;

  setCookie(c, REFRESH_COOKIE_NAME, refreshToken, {
    httpOnly: true,
    secure: config.NODE_ENV === 'production',
    sameSite: 'Lax',
    path: '/',
    maxAge: maxAgeSeconds
  });
}

export function getRefreshTokenCookie(c: Context): string | undefined {
  return getCookie(c, REFRESH_COOKIE_NAME);
}

export function clearRefreshTokenCookie(c: Context) {
  deleteCookie(c, REFRESH_COOKIE_NAME, {
    path: '/',
    secure: config.NODE_ENV === 'production',
    sameSite: 'Lax'
  });
}

// ─── Access Token Cookie (short-lived, 15m) ───────────────────────────────────

export function setAccessTokenCookie(c: Context, accessToken: string) {
  // 15 minutes in seconds
  const maxAgeSeconds = 15 * 60;

  setCookie(c, ACCESS_COOKIE_NAME, accessToken, {
    httpOnly: true,
    secure: config.NODE_ENV === 'production',
    sameSite: 'Lax',
    path: '/',
    maxAge: maxAgeSeconds
  });
}

export function getAccessTokenCookie(c: Context): string | undefined {
  return getCookie(c, ACCESS_COOKIE_NAME);
}

export function clearAccessTokenCookie(c: Context) {
  deleteCookie(c, ACCESS_COOKIE_NAME, {
    path: '/',
    secure: config.NODE_ENV === 'production',
    sameSite: 'Lax'
  });
}
