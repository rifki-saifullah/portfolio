import { db } from '../../db';

export const authRepository = {
  async findUserByEmail(email: string) {
    return db.user.findUnique({
      where: { email }
    });
  },

  async findUserById(id: string) {
    return db.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        avatarUrl: true,
        saweriaUrl: true,
        githubUrl: true,
        linkedinUrl: true,
        youtubeUrl: true,
        createdAt: true,
        updatedAt: true
      }
    });
  },

  async getFirstUser() {
    return db.user.findFirst({
      select: {
        id: true,
        name: true,
        email: true,
        avatarUrl: true,
        saweriaUrl: true,
        githubUrl: true,
        linkedinUrl: true,
        youtubeUrl: true,
        createdAt: true,
        updatedAt: true
      }
    });
  },

  async createRefreshToken(userId: string, token: string, expiresAt: Date) {
    return db.refreshToken.create({
      data: {
        userId,
        token,
        expiresAt
      }
    });
  },

  async findRefreshToken(token: string) {
    return db.refreshToken.findUnique({
      where: { token },
      include: { user: true }
    });
  },

  async revokeRefreshToken(token: string) {
    return db.refreshToken.updateMany({
      where: { token },
      data: { revoked: true }
    });
  },

  async revokeAllUserRefreshTokens(userId: string) {
    return db.refreshToken.updateMany({
      where: { userId },
      data: { revoked: true }
    });
  },

  async updateUser(id: string, data: { name?: string; email?: string; avatarUrl?: string | null; saweriaUrl?: string | null; githubUrl?: string | null; linkedinUrl?: string | null; youtubeUrl?: string | null }) {
    return db.user.update({
      where: { id },
      data,
      select: {
        id: true,
        name: true,
        email: true,
        avatarUrl: true,
        saweriaUrl: true,
        githubUrl: true,
        linkedinUrl: true,
        youtubeUrl: true,
        createdAt: true,
        updatedAt: true
      }
    });
  },

  async updatePassword(id: string, passwordHash: string) {
    return db.user.update({
      where: { id },
      data: { password: passwordHash }
    });
  }
};
