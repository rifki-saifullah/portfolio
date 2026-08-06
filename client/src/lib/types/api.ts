/** Standard API success response */
export interface ApiResponse<T = unknown> {
	success: true;
	message: string;
	data: T;
}

/** Standard API error response */
export interface ApiErrorResponse {
	success: false;
	code: ApiErrorCode;
	message: string;
	errors?: Record<string, string[]>;
}

/** Known API error codes */
export type ApiErrorCode =
	| 'VALIDATION_ERROR'
	| 'UNAUTHORIZED'
	| 'FORBIDDEN'
	| 'NOT_FOUND'
	| 'CONFLICT'
	| 'RATE_LIMITED'
	| 'SERVER_ERROR';

/** HTTP methods */
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

/** Request configuration for the API client */
export interface RequestConfig {
	method?: HttpMethod;
	body?: unknown;
	headers?: Record<string, string>;
	/** Skip the global error interceptor for this request */
	skipInterceptor?: boolean;
}

/** Discriminated union for API results — avoids throwing on expected errors */
export type ApiResult<T> =
	| { ok: true; data: T; message: string }
	| { ok: false; error: ApiErrorResponse };
