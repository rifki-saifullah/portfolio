import { expect, test, describe } from 'bun:test';
import { generateAccessToken, verifyAccessToken } from '../src/utils/paseto';

describe('PASETO Token Utility', () => {
  test('should generate and verify a valid PASETO token', async () => {
    const userPayload = {
      id: 'test-user-uuid',
      name: 'Test Admin',
      email: 'admin@test.com',
      avatarUrl: 'https://example.com/avatar.png'
    };

    const token = await generateAccessToken(userPayload);
    expect(token).toBeDefined();
    expect(typeof token).toBe('string');
    expect(token.startsWith('v4.public.')).toBe(true);

    const verifiedPayload = await verifyAccessToken(token);
    expect(verifiedPayload).not.toBeNull();
    expect(verifiedPayload?.sub).toBe(userPayload.id);
    expect(verifiedPayload?.name).toBe(userPayload.name);
    expect(verifiedPayload?.email).toBe(userPayload.email);
  });

  test('should return null for an invalid or tampered token', async () => {
    const invalidToken = 'v4.public.invalidpayload...';
    const verified = await verifyAccessToken(invalidToken);
    expect(verified).toBeNull();
  });
});
