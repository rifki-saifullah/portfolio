import { z } from 'zod';

export const localizedTextSchema = z.object({
  id: z.string().min(1, 'Bahasa Indonesia wajib diisi.'),
  en: z.string().optional().default(''),
  ja: z.string().optional().default('')
});

export const localizedTextOptionalSchema = z.object({
  id: z.string().optional().default(''),
  en: z.string().optional().default(''),
  ja: z.string().optional().default('')
});

export const contentBlockSchema = z.object({
  id: z.string().optional(),
  type: z.enum(['paragraph', 'code', 'rich-text', 'image']),
  value: localizedTextOptionalSchema
});

export const createPostSchema = z.object({
  title: localizedTextSchema,
  categoryId: z.number().int().positive('Kategori wajib dipilih.'),
  isDraft: z.boolean().optional().default(false),
  youtubeId: z.string().optional(),
  contentBlocks: z.array(contentBlockSchema).default([])
});

export const updatePostSchema = createPostSchema.partial();

export type CreatePostInput = z.infer<typeof createPostSchema>;
export type UpdatePostInput = z.infer<typeof updatePostSchema>;
