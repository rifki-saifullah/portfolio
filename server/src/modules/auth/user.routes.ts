import { Hono } from 'hono';
import { authMiddleware } from '../../middlewares/auth';
import { updateProfileSchema, changePasswordSchema } from './user.schema';
import { authRepository } from './auth.repository';
import { successResponse, errorResponse } from '../../utils/response';
import { cacheService } from '../../services/cache.service';

export const userRoutes = new Hono();

// GET /api/user/public-profile (Unauthenticated)
userRoutes.get('/public-profile', async (c) => {
  const user = await authRepository.getFirstUser();
  if (!user) {
    return errorResponse(c, 'NOT_FOUND', 'User tidak ditemukan.', undefined, 404);
  }
  return successResponse(c, user);
});

userRoutes.use('*', authMiddleware);

// GET /api/user/profile
userRoutes.get('/profile', async (c) => {
  const currentUser = c.get('user');
  const user = await authRepository.findUserById(currentUser.id);
  if (!user) {
    return errorResponse(c, 'NOT_FOUND', 'User tidak ditemukan.', undefined, 404);
  }
  return successResponse(c, user);
});

// PUT /api/user/profile
userRoutes.put('/profile', async (c) => {
  const currentUser = c.get('user');
  const body = await c.req.json();
  const parsed = updateProfileSchema.safeParse(body);

  if (!parsed.success) {
    const formattedErrors: Record<string, string[]> = {};
    parsed.error.issues.forEach((issue) => {
      const field = issue.path.join('.');
      if (!formattedErrors[field]) formattedErrors[field] = [];
      formattedErrors[field].push(issue.message);
    });
    return errorResponse(c, 'VALIDATION_ERROR', 'Validasi gagal.', formattedErrors, 400);
  }

  // Check email uniqueness if email changed
  if (parsed.data.email !== currentUser.email) {
    const existing = await authRepository.findUserByEmail(parsed.data.email);
    if (existing && existing.id !== currentUser.id) {
      return errorResponse(c, 'VALIDATION_ERROR', 'Email sudah digunakan.', { email: ['Email sudah digunakan.'] }, 400);
    }
  }

  const updatedUser = await authRepository.updateUser(currentUser.id, parsed.data);
  await cacheService.delete(`cache:user:${currentUser.id}`);

  return successResponse(c, updatedUser, 'Profil berhasil diperbarui.');
});

// PUT /api/user/change-password
userRoutes.put('/change-password', async (c) => {
  const currentUser = c.get('user');
  const body = await c.req.json();
  const parsed = changePasswordSchema.safeParse(body);

  if (!parsed.success) {
    const formattedErrors: Record<string, string[]> = {};
    parsed.error.issues.forEach((issue) => {
      const field = issue.path.join('.');
      if (!formattedErrors[field]) formattedErrors[field] = [];
      formattedErrors[field].push(issue.message);
    });
    return errorResponse(c, 'VALIDATION_ERROR', 'Validasi gagal.', formattedErrors, 400);
  }

  const dbUser = await authRepository.findUserByEmail(currentUser.email);
  if (!dbUser) {
    return errorResponse(c, 'NOT_FOUND', 'User tidak ditemukan.', undefined, 404);
  }

  const isMatch = await Bun.password.verify(parsed.data.oldPassword, dbUser.password);
  if (!isMatch) {
    return errorResponse(c, 'VALIDATION_ERROR', 'Password lama tidak cocok.', { oldPassword: ['Password lama tidak cocok.'] }, 400);
  }

  const newHash = await Bun.password.hash(parsed.data.newPassword);
  await authRepository.updatePassword(currentUser.id, newHash);

  return successResponse(c, null, 'Password berhasil diperbarui.');
});
