import { Hono } from 'hono';
import { authMiddleware } from '../../middlewares/auth';
import { successResponse, errorResponse } from '../../utils/response';
import { deleteUploadFile } from '../../utils/file';
import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';

export const uploadRoutes = new Hono();

const UPLOAD_DIR = join(process.cwd(), 'uploads');
const IMAGES_DIR = join(UPLOAD_DIR, 'images');
const AVATARS_DIR = join(UPLOAD_DIR, 'avatars');

// Ensure upload directories exist
if (!existsSync(IMAGES_DIR)) mkdirSync(IMAGES_DIR, { recursive: true });
if (!existsSync(AVATARS_DIR)) mkdirSync(AVATARS_DIR, { recursive: true });

async function handleFileUpload(c: any, subDir: string, fieldName: string) {
  const body = await c.req.parseBody();
  const file = body[fieldName];

  if (!file || !(file instanceof File)) {
    return errorResponse(c, 'VALIDATION_ERROR', `File '${fieldName}' wajib diunggah.`, undefined, 400);
  }

  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  if (!allowedTypes.includes(file.type)) {
    return errorResponse(c, 'VALIDATION_ERROR', 'Format file harus berupa JPG, PNG, WEBP, atau GIF.', undefined, 400);
  }

  const maxSize = 5 * 1024 * 1024; // 5MB
  if (file.size > maxSize) {
    return errorResponse(c, 'VALIDATION_ERROR', 'Ukuran file maksimal 5MB.', undefined, 400);
  }

  const ext = file.name.split('.').pop() || 'png';
  const fileName = `${crypto.randomUUID()}.${ext}`;
  const targetPath = join(UPLOAD_DIR, subDir, fileName);

  const arrayBuffer = await file.arrayBuffer();
  await Bun.write(targetPath, arrayBuffer);

  const fileUrl = `/uploads/${subDir}/${fileName}`;
  return successResponse(c, { url: fileUrl }, 'File berhasil diunggah.');
}

// POST /api/upload/image (Protected)
uploadRoutes.post('/image', authMiddleware, async (c) => {
  return handleFileUpload(c, 'images', 'image');
});

// POST /api/upload/avatar (Protected)
uploadRoutes.post('/avatar', authMiddleware, async (c) => {
  return handleFileUpload(c, 'avatars', 'avatar');
});

// DELETE /api/upload/file (Protected)
uploadRoutes.delete('/file', authMiddleware, async (c) => {
  const body = await c.req.json().catch(() => ({}));
  const url = body.url || c.req.query('url');

  if (!url) {
    return errorResponse(c, 'VALIDATION_ERROR', 'URL file wajib diberikan.', undefined, 400);
  }

  const deleted = deleteUploadFile(url);
  if (!deleted) {
    return errorResponse(c, 'NOT_FOUND', 'File tidak ditemukan atau gagal dihapus.', undefined, 404);
  }

  return successResponse(c, null, 'File berhasil dihapus dari storage.');
});
