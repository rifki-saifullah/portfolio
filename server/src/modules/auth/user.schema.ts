import { z } from 'zod';

export const updateProfileSchema = z.object({
  name: z.string().min(1, 'Nama wajib diisi.'),
  email: z.string().min(1, 'Email wajib diisi.').email('Format email tidak valid.'),
  avatarUrl: z.string().optional().nullable(),
  saweriaUrl: z.string().optional().nullable(),
  githubUrl: z.string().optional().nullable(),
  linkedinUrl: z.string().optional().nullable(),
  youtubeUrl: z.string().optional().nullable()
});

export const changePasswordSchema = z.object({
  oldPassword: z.string().min(1, 'Password lama wajib diisi.'),
  newPassword: z.string().min(6, 'Password baru minimal 6 karakter.'),
  confirmPassword: z.string().min(1, 'Konfirmasi password wajib diisi.')
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Konfirmasi password tidak cocok dengan password baru.',
  path: ['confirmPassword']
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
