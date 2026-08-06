import { apiClient } from '$lib/api/client';
import { ENDPOINTS } from '$lib/api/endpoints';
import type { Post, PaginatedData } from '$lib/types';
import type { ApiResult } from '$lib/types/api';

export const postService = {
	async getAll(params?: { page?: number; limit?: number; categoryId?: number; isDraft?: boolean }): Promise<ApiResult<PaginatedData<Post>>> {
		const query = new URLSearchParams();
		if (params?.page) query.append('page', params.page.toString());
		if (params?.limit) query.append('limit', params.limit.toString());
		if (params?.categoryId) query.append('categoryId', params.categoryId.toString());
		if (params?.isDraft !== undefined) query.append('isDraft', params.isDraft.toString());

		const queryString = query.toString();
		const endpoint = `${ENDPOINTS.POSTS.BASE}${queryString ? `?${queryString}` : ''}`;

		return apiClient.get<PaginatedData<Post>>(endpoint);
	},

	async getById(id: string): Promise<ApiResult<Post>> {
		return apiClient.get<Post>(ENDPOINTS.POSTS.BY_ID(id));
	},

	async create(data: Omit<Post, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResult<Post>> {
		return apiClient.post<Post>(ENDPOINTS.POSTS.BASE, data);
	},

	async update(id: string, data: Partial<Post>): Promise<ApiResult<Post>> {
		return apiClient.put<Post>(ENDPOINTS.POSTS.BY_ID(id), data);
	},

	async delete(id: string): Promise<ApiResult<null>> {
		return apiClient.delete<null>(ENDPOINTS.POSTS.BY_ID(id));
	}
};
