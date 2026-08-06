import { existsSync, unlinkSync } from 'fs';
import { join, normalize } from 'path';

/**
 * Delete a file from the uploads directory safely.
 * Prevents directory traversal attacks by validating that the resolved path
 * remains within the designated upload directory.
 */
export function deleteUploadFile(fileUrl?: string): boolean {
  if (!fileUrl || typeof fileUrl !== 'string') return false;

  let relativePath = fileUrl;
  if (fileUrl.includes('/uploads/')) {
    relativePath = fileUrl.substring(fileUrl.indexOf('/uploads/'));
  }

  if (!relativePath.startsWith('/uploads/')) return false;

  const uploadDir = normalize(join(process.cwd(), 'uploads'));
  const fullPath = normalize(join(process.cwd(), relativePath));

  // Security check: path traversal prevention
  if (!fullPath.startsWith(uploadDir)) return false;

  if (existsSync(fullPath)) {
    try {
      unlinkSync(fullPath);
      return true;
    } catch (e) {
      console.error(`Gagal menghapus file ${fullPath}:`, e);
      return false;
    }
  }

  return false;
}
