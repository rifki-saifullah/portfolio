import type { Context } from 'hono';
import { ZodError } from 'zod';
import { errorResponse } from '../utils/response';

export function globalErrorHandler(err: Error, c: Context) {
  console.error('Unhandled Error:', err);

  if (err instanceof ZodError) {
    const formattedErrors: Record<string, string[]> = {};
    err.issues.forEach((issue) => {
      const pathStr = issue.path.join('.');
      if (!formattedErrors[pathStr]) {
        formattedErrors[pathStr] = [];
      }
      formattedErrors[pathStr].push(issue.message);
    });

    return errorResponse(
      c,
      'VALIDATION_ERROR',
      'Data yang dikirimkan tidak valid.',
      formattedErrors,
      400
    );
  }

  return errorResponse(
    c,
    'SERVER_ERROR',
    err.message || 'Terjadi kesalahan pada server.',
    undefined,
    500
  );
}
