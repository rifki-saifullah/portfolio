import type { Context } from 'hono';
import type { ContentfulStatusCode } from 'hono/utils/http-status';
import type { ApiErrorCode, ApiErrorResponse, ApiResponse } from '../types';

export function successResponse<T>(c: Context, data: T, message = 'OK', status: ContentfulStatusCode = 200) {
  const body: ApiResponse<T> = {
    success: true,
    message,
    data
  };
  return c.json(body, status);
}

export function errorResponse(
  c: Context,
  code: ApiErrorCode,
  message: string,
  errors?: Record<string, string[]>,
  status: ContentfulStatusCode = 400
) {
  const body: ApiErrorResponse = {
    success: false,
    code,
    message,
    ...(errors && { errors })
  };
  return c.json(body, status);
}
