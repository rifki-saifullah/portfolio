import { apiClient } from '$lib/api/client';
import { ENDPOINTS } from '$lib/api/endpoints';
import { env } from '$env/dynamic/public';
import type { User } from '$lib/types';
import type { ApiResult } from '$lib/types/api';

const getApiBase = () => env.PUBLIC_API_URL ?? 'http://localhost:3000/api';

export const userService = {
	async getProfile(): Promise<ApiResult<User>> {
		return apiClient.get<User>(ENDPOINTS.USER.PROFILE);
	},

	async getPublicProfile(): Promise<ApiResult<User>> {
		return apiClient.get<User>(ENDPOINTS.USER.PUBLIC_PROFILE, { skipInterceptor: true });
	},

	async updateProfile(data: {
		name: string;
		email: string;
		avatarUrl?: string;
		saweriaUrl?: string;
		githubUrl?: string;
		linkedinUrl?: string;
		youtubeUrl?: string;
	}): Promise<ApiResult<User>> {
		return apiClient.put<User>(ENDPOINTS.USER.PROFILE, data);
	},

	async changePassword(data: { oldPassword: string; newPassword: string; confirmPassword: string }): Promise<ApiResult<null>> {
		return apiClient.put<null>(ENDPOINTS.USER.CHANGE_PASSWORD, data);
	},

	async uploadAvatar(file: File): Promise<ApiResult<{ url: string }>> {
		const formData = new FormData();
		formData.append('avatar', file);

		try {
			const res = await fetch(`${getApiBase()}${ENDPOINTS.UPLOAD.AVATAR}`, {
				method: 'POST',
				body: formData,
				credentials: 'include'
			});
			const json = await res.json();
			if (res.ok) {
				return { ok: true, data: json.data, message: json.message };
			}
			return { ok: false, error: json };
		} catch (err) {
			return { ok: false, error: { success: false, code: 'SERVER_ERROR', message: 'Upload gagal' } };
		}
	},

	async uploadImage(file: File): Promise<ApiResult<{ url: string }>> {
		const formData = new FormData();
		formData.append('image', file);

		try {
			const res = await fetch(`${getApiBase()}${ENDPOINTS.UPLOAD.IMAGE}`, {
				method: 'POST',
				body: formData,
				credentials: 'include'
			});
			const json = await res.json();
			if (res.ok) {
				return { ok: true, data: json.data, message: json.message };
			}
			return { ok: false, error: json };
		} catch (err) {
			return { ok: false, error: { success: false, code: 'SERVER_ERROR', message: 'Upload gagal' } };
		}
	},

	async deleteFile(url: string): Promise<ApiResult<null>> {
		return apiClient.delete<null>('/upload/file', { data: { url } });
	}
};
