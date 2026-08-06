export type Lang = 'id' | 'en' | 'ja';

export interface LocalizedText {
  id: string;
  en: string;
  ja: string;
}

export interface UserPayload {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
}

export type ApiErrorCode =
  | 'VALIDATION_ERROR'
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'CONFLICT'
  | 'RATE_LIMITED'
  | 'SERVER_ERROR';

export interface ApiResponse<T = unknown> {
  success: true;
  message: string;
  data: T;
}

export interface ApiErrorResponse {
  success: false;
  code: ApiErrorCode;
  message: string;
  errors?: Record<string, string[]>;
}

export interface PaginationMeta {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  perPage: number;
}

export interface PaginatedData<T> {
  items: T[];
  meta: PaginationMeta;
}
