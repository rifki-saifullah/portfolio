import { authRepository } from './auth.repository';
import { generateAccessToken } from '../../utils/paseto';
import { config } from '../../config';
import { cacheService } from '../../services/cache.service';
import type { LoginInput } from './auth.schema';
import type { UserPayload } from '../../types';

export const authService = {
  async login(input: LoginInput) {
    const user = await authRepository.findUserByEmail(input.email);
    if (!user) {
      return { ok: false as const, error: 'Email atau password salah.' };
    }

    const isMatch = await Bun.password.verify(input.password, user.password);
    if (!isMatch) {
      return { ok: false as const, error: 'Email atau password salah.' };
    }

    const userPayload: UserPayload = {
      id: user.id,
      name: user.name,
      email: user.email,
      avatarUrl: user.avatarUrl ?? undefined
    };

    const accessToken = await generateAccessToken(userPayload);

    // Create Refresh Token (UUID v4)
    const refreshTokenUUID = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + config.REFRESH_TOKEN_EXPIRES_DAYS * 24 * 60 * 60 * 1000);
    
    await authRepository.createRefreshToken(user.id, refreshTokenUUID, expiresAt);

    return {
      ok: true as const,
      user: userPayload,
      accessToken,
      refreshToken: refreshTokenUUID
    };
  },

  async refresh(refreshTokenUUID: string) {
    const tokenRecord = await authRepository.findRefreshToken(refreshTokenUUID);

    if (!tokenRecord || tokenRecord.revoked || tokenRecord.expiresAt < new Date()) {
      return { ok: false as const, error: 'Refresh token tidak valid atau telah kadaluwarsa.' };
    }

    const user = tokenRecord.user;
    const userPayload: UserPayload = {
      id: user.id,
      name: user.name,
      email: user.email,
      avatarUrl: user.avatarUrl ?? undefined
    };

    // Rotate refresh token
    await authRepository.revokeRefreshToken(refreshTokenUUID);

    const newRefreshTokenUUID = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + config.REFRESH_TOKEN_EXPIRES_DAYS * 24 * 60 * 60 * 1000);
    await authRepository.createRefreshToken(user.id, newRefreshTokenUUID, expiresAt);

    const accessToken = await generateAccessToken(userPayload);

    return {
      ok: true as const,
      user: userPayload,
      accessToken,
      refreshToken: newRefreshTokenUUID
    };
  },

  async logout(accessToken?: string, refreshTokenUUID?: string) {
    // 1. Blacklist Access Token in Redis (15m TTL)
    if (accessToken) {
      await cacheService.blacklistToken(accessToken, 900);
    }

    // 2. Revoke Refresh Token in Database
    if (refreshTokenUUID) {
      await authRepository.revokeRefreshToken(refreshTokenUUID);
    }
  },

  async getCurrentUser(userId: string) {
    const cacheKey = `cache:user:${userId}`;
    const cachedUser = await cacheService.get<any>(cacheKey);
    if (cachedUser) return cachedUser;

    const user = await authRepository.findUserById(userId);
    if (user) {
      await cacheService.set(cacheKey, user, 900); // 15 mins cache
    }
    return user;
  }
};
