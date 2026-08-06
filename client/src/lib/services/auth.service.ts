import { apiClient } from '$lib/api/client';
import { ENDPOINTS } from '$lib/api/endpoints';
import { authStore } from '$lib/stores/auth.svelte.js';
import type { User } from '$lib/types';
import type { ApiResult } from '$lib/types/api';

interface LoginResponse {
	user: User;
	accessToken: string;
}

export const authService = {
	async login(email: string, password: string): Promise<ApiResult<LoginResponse>> {
		// Token is set as httpOnly cookie by backend — no need to store it here.
		const result = await apiClient.post<LoginResponse>(ENDPOINTS.AUTH.LOGIN, { email, password });

		if (result.ok) {
			authStore.setAuth(result.data.user);
		}

		return result;
	},

	async logout(): Promise<void> {
		await apiClient.post(ENDPOINTS.AUTH.LOGOUT, {});
		authStore.clearAuth();
	},

	async getCurrentUser(): Promise<ApiResult<User>> {
		return apiClient.get<User>(ENDPOINTS.AUTH.ME);
	}
};
