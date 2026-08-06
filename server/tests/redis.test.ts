import { expect, test, describe, spyOn } from 'bun:test';
import { app } from '../src/app';
import { generateAccessToken } from '../src/utils/paseto';
import { cacheService } from '../src/services/cache.service';
import { authService } from '../src/modules/auth/auth.service';

describe('Redis Blacklisting & Token Revocation', () => {
  test('should reject request when access token is blacklisted in Redis', async () => {
    spyOn(authService, 'getCurrentUser').mockResolvedValue({
      id: 'test-user-id',
      name: 'Rifki',
      email: 'admin@example.com',
      createdAt: new Date(),
      updatedAt: new Date()
    });

    const token = await generateAccessToken({
      id: 'test-user-id',
      name: 'Rifki',
      email: 'admin@example.com'
    });

    // 1. Initial request with valid token -> 200 OK
    const res1 = await app.request('/api/auth/me', {
      headers: { Authorization: `Bearer ${token}` }
    });
    expect(res1.status).toBe(200);

    // 2. Blacklist the token in Redis
    await cacheService.blacklistToken(token, 60);

    // 3. Subsequent request with blacklisted token -> 401 Unauthorized
    const res2 = await app.request('/api/auth/me', {
      headers: { Authorization: `Bearer ${token}` }
    });

    expect(res2.status).toBe(401);
    const body2 = await res2.json();
    expect(body2.success).toBe(false);
    expect(body2.message).toContain('dicabut');
  });

  test('cacheService hashToken should produce deterministic sha256 hex', async () => {
    const { hashToken } = await import('../src/services/cache.service');
    const h1 = await hashToken('my-paseto-token');
    const h2 = await hashToken('my-paseto-token');
    expect(h1).toBe(h2);
    expect(h1.length).toBe(64);
  });
});
