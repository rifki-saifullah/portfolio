import { expect, test, describe, spyOn } from 'bun:test';
import { app } from '../src/app';
import { generateAccessToken } from '../src/utils/paseto';
import { authService } from '../src/modules/auth/auth.service';

describe('Auth Routes (/api/auth)', () => {
  test('GET /health should return 200 OK', async () => {
    const res = await app.request('/health');
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.status).toBe('ok');
  });

  test('POST /api/auth/login should reject invalid body', async () => {
    const res = await app.request('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'invalid-email', password: '123' })
    });

    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.success).toBe(false);
    expect(body.code).toBe('VALIDATION_ERROR');
  });

  test('GET /api/auth/me should reject request without Bearer token', async () => {
    const res = await app.request('/api/auth/me');
    expect(res.status).toBe(401);
    const body = await res.json();
    expect(body.success).toBe(false);
    expect(body.code).toBe('UNAUTHORIZED');
  });

  test('GET /api/auth/me should accept valid PASETO token', async () => {
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

    const res = await app.request('/api/auth/me', {
      headers: { Authorization: `Bearer ${token}` }
    });

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.data.id).toBe('test-user-id');
  });
});
