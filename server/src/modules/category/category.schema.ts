import { z } from 'zod';

export const localizedTextSchema = z.object({
  id: z.string().min(1, 'Nama kategori (ID) wajib diisi.'),
  en: z.string().default(''),
  ja: z.string().default('')
});

export const createCategorySchema = z.object({
  name: localizedTextSchema
});

export const updateCategorySchema = z.object({
  name: localizedTextSchema
});

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
