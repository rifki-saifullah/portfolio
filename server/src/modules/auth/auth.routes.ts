import { Hono } from 'hono';
import { loginSchema } from './auth.schema';
import { authService } from './auth.service';
import { successResponse, errorResponse } from '../../utils/response';
import {
  setRefreshTokenCookie,
  getRefreshTokenCookie,
  clearRefreshTokenCookie,
  setAccessTokenCookie,
  clearAccessTokenCookie
} from '../../utils/cookie';
import { authMiddleware } from '../../middlewares/auth';
import { createRateLimiter } from '../../middlewares/rate-limiter';

export const authRoutes = new Hono();

// Rate limiter khusus login (5 attempt per 1 menit)
const loginLimiter = createRateLimiter({ windowMs: 60 * 1000, max: 5 });

authRoutes.post('/login', loginLimiter, async (c) => {
  const body = await c.req.json();
  const parsed = loginSchema.safeParse(body);

  if (!parsed.success) {
    const formattedErrors: Record<string, string[]> = {};
    parsed.error.issues.forEach((issue) => {
      const field = issue.path.join('.');
      if (!formattedErrors[field]) formattedErrors[field] = [];
      formattedErrors[field].push(issue.message);
    });

    return errorResponse(c, 'VALIDATION_ERROR', 'Email atau password salah.', formattedErrors, 400);
  }

  const result = await authService.login(parsed.data);

  if (!result.ok) {
    return errorResponse(c, 'VALIDATION_ERROR', result.error, { email: [result.error] }, 400);
  }

  setRefreshTokenCookie(c, result.refreshToken);
  setAccessTokenCookie(c, result.accessToken);

  return successResponse(
    c,
    {
      user: result.user,
      accessToken: result.accessToken
    },
    'Login berhasil.'
  );
});

authRoutes.post('/refresh', async (c) => {
  const refreshToken = getRefreshTokenCookie(c);
  if (!refreshToken) {
    return errorResponse(c, 'UNAUTHORIZED', 'Refresh token tidak ditemukan.', undefined, 401);
  }

  const result = await authService.refresh(refreshToken);

  if (!result.ok) {
    clearRefreshTokenCookie(c);
    return errorResponse(c, 'UNAUTHORIZED', result.error, undefined, 401);
  }

  setRefreshTokenCookie(c, result.refreshToken);
  setAccessTokenCookie(c, result.accessToken);

  return successResponse(
    c,
    {
      accessToken: result.accessToken
    },
    'Token berhasil diperbarui.'
  );
});

authRoutes.post('/logout', async (c) => {
  const authHeader = c.req.header('Authorization');
  const accessToken = authHeader && authHeader.startsWith('Bearer ') ? authHeader.substring(7) : undefined;
  const refreshToken = getRefreshTokenCookie(c);

  await authService.logout(accessToken, refreshToken);
  clearRefreshTokenCookie(c);
  clearAccessTokenCookie(c);

  return successResponse(c, null, 'Logout berhasil.');
});

authRoutes.get('/me', authMiddleware, async (c) => {
  const currentUser = c.get('user');
  const user = await authService.getCurrentUser(currentUser.id);

  if (!user) {
    return errorResponse(c, 'NOT_FOUND', 'User tidak ditemukan.', undefined, 404);
  }

  return successResponse(c, user, 'OK');
});
