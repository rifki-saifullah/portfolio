import { Hono } from 'hono';
import { createCategorySchema, updateCategorySchema } from './category.schema';
import { categoryRepository } from './category.repository';
import { successResponse, errorResponse } from '../../utils/response';
import { authMiddleware } from '../../middlewares/auth';
import { httpCache } from '../../middlewares/cache';
import { cacheService } from '../../services/cache.service';

export const categoryRoutes = new Hono();

// GET /api/categories
categoryRoutes.get('/', async (c) => {
  const pageParam = c.req.query('page');
  const limitParam = c.req.query('limit');

  // If no page/limit params are provided, return all categories
  if (!pageParam && !limitParam) {
    const categories = await categoryRepository.findAll();
    return successResponse(c, {
      items: categories,
      meta: {
        currentPage: 1,
        totalPages: 1,
        totalItems: categories.length,
        perPage: categories.length
      }
    });
  }

  const page = parseInt(pageParam || '1', 10);
  const limit = parseInt(limitParam || '10', 10);

  const data = await categoryRepository.findPaginated(page, limit);
  return successResponse(c, data);
});

// POST /api/categories - Tambah kategori baru (Protected)
categoryRoutes.post('/', authMiddleware, async (c) => {
  const body = await c.req.json();
  const parsed = createCategorySchema.safeParse(body);

  if (!parsed.success) {
    const formattedErrors: Record<string, string[]> = {};
    parsed.error.issues.forEach((issue) => {
      const field = issue.path.join('.');
      if (!formattedErrors[field]) formattedErrors[field] = [];
      formattedErrors[field].push(issue.message);
    });

    return errorResponse(c, 'VALIDATION_ERROR', 'Nama kategori (ID) wajib diisi.', formattedErrors, 400);
  }

  const newCategory = await categoryRepository.create(parsed.data.name);

  // Invalidate categories & posts caches
  await cacheService.invalidatePattern('cache:categories:*');
  await cacheService.invalidatePattern('cache:posts:*');

  return successResponse(c, newCategory, 'Kategori berhasil ditambahkan.', 201);
});

// PUT /api/categories/:id - Update kategori (Protected)
categoryRoutes.put('/:id', authMiddleware, async (c) => {
  const id = parseInt(c.req.param('id'), 10);
  if (isNaN(id)) {
    return errorResponse(c, 'VALIDATION_ERROR', 'ID kategori tidak valid.', undefined, 400);
  }

  const existing = await categoryRepository.findById(id);
  if (!existing) {
    return errorResponse(c, 'NOT_FOUND', 'Kategori tidak ditemukan.', undefined, 404);
  }

  const body = await c.req.json();
  const parsed = updateCategorySchema.safeParse(body);

  if (!parsed.success) {
    const formattedErrors: Record<string, string[]> = {};
    parsed.error.issues.forEach((issue) => {
      const field = issue.path.join('.');
      if (!formattedErrors[field]) formattedErrors[field] = [];
      formattedErrors[field].push(issue.message);
    });

    return errorResponse(c, 'VALIDATION_ERROR', 'Validasi gagal.', formattedErrors, 400);
  }

  const updatedCategory = await categoryRepository.update(id, parsed.data.name);

  // Invalidate categories & posts caches
  await cacheService.invalidatePattern('cache:categories:*');
  await cacheService.invalidatePattern('cache:posts:*');

  return successResponse(c, updatedCategory, 'Kategori berhasil diperbarui.');
});

// DELETE /api/categories/:id - Hapus kategori (Protected)
categoryRoutes.delete('/:id', authMiddleware, async (c) => {
  const id = parseInt(c.req.param('id'), 10);
  if (isNaN(id)) {
    return errorResponse(c, 'VALIDATION_ERROR', 'ID kategori tidak valid.', undefined, 400);
  }

  const existing = await categoryRepository.findById(id);
  if (!existing) {
    return errorResponse(c, 'NOT_FOUND', 'Kategori tidak ditemukan.', undefined, 404);
  }

  const postCount = await categoryRepository.countPosts(id);
  if (postCount > 0) {
    return errorResponse(c, 'CATEGORY_HAS_POSTS', 'Kategori tidak dapat dihapus karena masih digunakan oleh postingan.', { postCount }, 400);
  }

  await categoryRepository.delete(id);

  // Invalidate categories & posts caches
  await cacheService.invalidatePattern('cache:categories:*');
  await cacheService.invalidatePattern('cache:posts:*');

  return successResponse(c, null, 'Kategori berhasil dihapus.');
});
