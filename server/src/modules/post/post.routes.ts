import { Hono } from 'hono';
import { createPostSchema, updatePostSchema } from './post.schema';
import { postRepository } from './post.repository';
import { successResponse, errorResponse } from '../../utils/response';
import { authMiddleware } from '../../middlewares/auth';
import { httpCache } from '../../middlewares/cache';
import { cacheService } from '../../services/cache.service';

export const postRoutes = new Hono();

// GET /api/posts - Get paginated posts (Cached for 15 mins)
postRoutes.get('/', httpCache(900, 'cache:posts'), async (c) => {
  const page = parseInt(c.req.query('page') || '1', 10);
  const limit = parseInt(c.req.query('limit') || '20', 10);
  const categoryIdRaw = c.req.query('categoryId');
  const categoryId = categoryIdRaw ? parseInt(categoryIdRaw, 10) : undefined;
  const isDraftRaw = c.req.query('isDraft');
  const isDraft = isDraftRaw !== undefined ? isDraftRaw === 'true' : undefined;
  const search = c.req.query('search');

  const result = await postRepository.findAll({ page, limit, categoryId, isDraft, search });
  return successResponse(c, result);
});

// GET /api/posts/:id - Get detail post by ID (Cached for 30 mins)
postRoutes.get('/:id', httpCache(1800, 'cache:posts'), async (c) => {
  const id = c.req.param('id');
  const post = await postRepository.findById(id);

  if (!post) {
    return errorResponse(c, 'NOT_FOUND', 'Postingan tidak ditemukan.', undefined, 404);
  }

  return successResponse(c, post);
});

// POST /api/posts - Create post (Protected)
postRoutes.post('/', authMiddleware, async (c) => {
  const body = await c.req.json();
  const parsed = createPostSchema.safeParse(body);

  if (!parsed.success) {
    const formattedErrors: Record<string, string[]> = {};
    parsed.error.issues.forEach((issue) => {
      const field = issue.path.join('.');
      if (!formattedErrors[field]) formattedErrors[field] = [];
      formattedErrors[field].push(issue.message);
    });

    return errorResponse(c, 'VALIDATION_ERROR', 'Validasi gagal.', formattedErrors, 400);
  }

  const post = await postRepository.create(parsed.data);

  // Invalidate post caches
  await cacheService.invalidatePattern('cache:posts:*');

  return successResponse(c, post, 'Postingan berhasil dibuat.', 201);
});

// PUT /api/posts/:id - Update post (Protected)
postRoutes.put('/:id', authMiddleware, async (c) => {
  const id = c.req.param('id');
  const body = await c.req.json();
  const parsed = updatePostSchema.safeParse(body);

  if (!parsed.success) {
    const formattedErrors: Record<string, string[]> = {};
    parsed.error.issues.forEach((issue) => {
      const field = issue.path.join('.');
      if (!formattedErrors[field]) formattedErrors[field] = [];
      formattedErrors[field].push(issue.message);
    });

    return errorResponse(c, 'VALIDATION_ERROR', 'Validasi gagal.', formattedErrors, 400);
  }

  const updated = await postRepository.update(id, parsed.data);
  if (!updated) {
    return errorResponse(c, 'NOT_FOUND', 'Postingan tidak ditemukan.', undefined, 404);
  }

  // Invalidate post caches
  await cacheService.invalidatePattern('cache:posts:*');

  return successResponse(c, updated, 'Postingan berhasil diperbarui.');
});

// DELETE /api/posts/:id - Delete post (Protected)
postRoutes.delete('/:id', authMiddleware, async (c) => {
  const id = c.req.param('id');
  const deleted = await postRepository.delete(id);

  if (!deleted) {
    return errorResponse(c, 'NOT_FOUND', 'Postingan tidak ditemukan.', undefined, 404);
  }

  // Invalidate post caches
  await cacheService.invalidatePattern('cache:posts:*');

  return successResponse(c, null, 'Postingan berhasil dihapus.');
});
