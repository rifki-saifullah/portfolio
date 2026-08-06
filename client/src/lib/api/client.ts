import { env } from '$env/dynamic/public';
import type { ApiErrorResponse, ApiResponse, ApiResult, RequestConfig } from '$lib/types/api';
import { handleResponseError } from './interceptor';
import { getAuthHeaders } from './interceptor';

const getBaseUrl = (): string => env.PUBLIC_API_URL ?? 'http://localhost:3000/api';

let isRefreshing = false;

/**
 * Core HTTP client — all API requests must go through this module.
 * Automatically injects auth/language headers via the interceptor.
 * Performs silent token refresh on 401 Unauthorized status.
 */
async function request<T>(endpoint: string, config: RequestConfig = {}): Promise<ApiResult<T>> {
	const { method = 'GET', body, headers = {}, skipInterceptor = false } = config;

	const url = `${getBaseUrl()}${endpoint}`;

	const mergedHeaders: Record<string, string> = {
		'Content-Type': 'application/json',
		...getAuthHeaders(),
		...headers
	};

	const fetchOptions: RequestInit = {
		method,
		headers: mergedHeaders,
		credentials: 'include'
	};

	if (body && method !== 'GET') {
		fetchOptions.body = JSON.stringify(body);
	}

	try {
		let response = await fetch(url, fetchOptions);

		// Handle 401 Unauthorized — attempt silent token refresh once
		if (
			response.status === 401 &&
			!endpoint.includes('/auth/login') &&
			!endpoint.includes('/auth/refresh') &&
			!isRefreshing
		) {
			isRefreshing = true;
			try {
				const refreshRes = await fetch(`${getBaseUrl()}/auth/refresh`, {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					credentials: 'include'
				});

				if (refreshRes.ok) {
					// Retry original request with newly set access_token cookie
					response = await fetch(url, fetchOptions);
				}
			} catch {
				// Refresh failed
			} finally {
				isRefreshing = false;
			}
		}

		if (response.ok) {
			const json = (await response.json()) as ApiResponse<T>;
			return { ok: true, data: json.data, message: json.message };
		}

		const errorJson = (await response.json().catch(() => ({
			success: false as const,
			code: 'SERVER_ERROR' as const,
			message: 'An unexpected error occurred.'
		}))) as ApiErrorResponse;

		if (!skipInterceptor) {
			handleResponseError(response.status, errorJson);
		}

		return { ok: false, error: errorJson };
	} catch (err) {
		const networkError: ApiErrorResponse = {
			success: false,
			code: 'SERVER_ERROR',
			message: err instanceof Error ? err.message : 'Network error'
		};

		if (!skipInterceptor) {
			handleResponseError(0, networkError);
		}

		return { ok: false, error: networkError };
	}
}

export const apiClient = {
	get: <T>(endpoint: string, config?: RequestConfig) =>
		request<T>(endpoint, { ...config, method: 'GET' }),

	post: <T>(endpoint: string, body: unknown, config?: RequestConfig) =>
		request<T>(endpoint, { ...config, method: 'POST', body }),

	put: <T>(endpoint: string, body: unknown, config?: RequestConfig) =>
		request<T>(endpoint, { ...config, method: 'PUT', body }),

	patch: <T>(endpoint: string, body: unknown, config?: RequestConfig) =>
		request<T>(endpoint, { ...config, method: 'PATCH', body }),

	delete: <T>(endpoint: string, config?: RequestConfig) =>
		request<T>(endpoint, { ...config, method: 'DELETE' })
};
