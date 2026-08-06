import { apiClient } from '$lib/api/client';
import { ENDPOINTS } from '$lib/api/endpoints';
import type { Category, PaginatedData } from '$lib/types';
import type { ApiResult } from '$lib/types/api';

export const categoryService = {
	async getAll(page?: number, limit?: number): Promise<ApiResult<PaginatedData<Category>>> {
		const query = page && limit ? `?page=${page}&limit=${limit}` : '';
		return apiClient.get<PaginatedData<Category>>(`${ENDPOINTS.CATEGORIES.BASE}${query}`);
	},

	async create(name: Category['name']): Promise<ApiResult<Category>> {
		return apiClient.post<Category>(ENDPOINTS.CATEGORIES.BASE, { name });
	},

	async update(id: number, name: Category['name']): Promise<ApiResult<Category>> {
		return apiClient.put<Category>(ENDPOINTS.CATEGORIES.BY_ID(id), { name });
	},

	async delete(id: number): Promise<ApiResult<null>> {
		return apiClient.delete<null>(ENDPOINTS.CATEGORIES.BY_ID(id));
	}
};
