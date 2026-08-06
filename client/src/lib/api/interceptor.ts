import type { ApiErrorResponse } from '$lib/types/api';
import { authStore } from '$lib/stores/auth.svelte.js';
import { toastStore } from '$lib/stores/toast.svelte.js';
import { goto } from '$app/navigation';

/**
 * Returns standard headers for every API request.
 * Token is in httpOnly cookie, sent automatically by the browser.
 * We only need to send Accept-Language here.
 */
export function getAuthHeaders(): Record<string, string> {
	return {};
}

/**
 * Global HTTP response error handler.
 * Handles redirect, toast, and field-error logic based on status codes.
 */
export function handleResponseError(status: number, error: ApiErrorResponse): void {
	switch (status) {
		case 400:
		case 422:
			// Validation errors — handled by the calling form, not here.
			break;

		case 401:
			// Clear local user state. The server-side hook will handle redirect
			// on next navigation. For immediate client feedback, redirect now.
			authStore.clearAuth();
			goto('/login');
			break;

		case 403:
		case 404:
		case 409:
		case 429:
			toastStore.error(error.message);
			break;

		default:
			// 500+ or network errors
			toastStore.error(error.message || 'An unexpected error occurred.');
			break;
	}
}
