import { http, HttpResponse, delay } from 'msw';
import { mockCategories, mockPosts, mockUser, MOCK_PASSWORD } from './data';
import type { Category } from '$lib/types';

let categories = [...mockCategories];
let posts = [...mockPosts];
let nextCategoryId = 100;

export const handlers = [
	// ===== AUTH =====
	http.post('*/auth/login', async ({ request }) => {
		await delay(500);
		const body = (await request.json()) as { email: string; password: string };

		if (body.email === mockUser.email && body.password === MOCK_PASSWORD) {
			return HttpResponse.json({
				success: true,
				message: 'Login berhasil.',
				data: {
					user: mockUser,
					accessToken: 'mock-jwt-token-' + Date.now()
				}
			});
		}

		return HttpResponse.json(
			{
				success: false,
				code: 'VALIDATION_ERROR',
				message: 'Email atau password salah.',
				errors: { email: ['Email atau password salah.'] }
			},
			{ status: 400 }
		);
	}),

	http.post('*/auth/logout', async () => {
		await delay(200);
		return HttpResponse.json({
			success: true,
			message: 'Logout berhasil.',
			data: null
		});
	}),

	http.get('*/auth/me', async ({ request }) => {
		await delay(300);
		const auth = request.headers.get('Authorization');
		if (!auth || !auth.startsWith('Bearer mock-jwt-token-')) {
			return HttpResponse.json(
				{ success: false, code: 'UNAUTHORIZED', message: 'Token tidak valid.' },
				{ status: 401 }
			);
		}
		return HttpResponse.json({
			success: true,
			message: 'OK',
			data: mockUser
		});
	}),

	// ===== CATEGORIES =====
	http.get('*/categories', async () => {
		await delay(400);
		return HttpResponse.json({
			success: true,
			message: 'OK',
			data: {
				items: categories,
				meta: { currentPage: 1, totalPages: 1, totalItems: categories.length, perPage: 20 }
			}
		});
	}),

	http.post('*/categories', async ({ request }) => {
		await delay(400);
		const body = (await request.json()) as { name: Category['name'] };

		if (!body.name?.id?.trim()) {
			return HttpResponse.json(
				{
					success: false,
					code: 'VALIDATION_ERROR',
					message: 'Nama kategori (ID) wajib diisi.',
					errors: { 'name.id': ['Nama kategori (ID) wajib diisi.'] }
				},
				{ status: 400 }
			);
		}

		const newCat: Category = { id: nextCategoryId++, name: body.name };
		categories.push(newCat);

		return HttpResponse.json({
			success: true,
			message: 'Kategori berhasil ditambahkan.',
			data: newCat
		}, { status: 201 });
	}),

	http.put('*/categories/:id', async ({ params, request }) => {
		await delay(400);
		const id = Number(params.id);
		const body = (await request.json()) as { name: Category['name'] };
		const index = categories.findIndex((c) => c.id === id);

		if (index === -1) {
			return HttpResponse.json(
				{ success: false, code: 'NOT_FOUND', message: 'Kategori tidak ditemukan.' },
				{ status: 404 }
			);
		}

		categories[index] = { ...categories[index], name: body.name };

		return HttpResponse.json({
			success: true,
			message: 'Kategori berhasil diperbarui.',
			data: categories[index]
		});
	}),

	http.delete('*/categories/:id', async ({ params }) => {
		await delay(300);
		const id = Number(params.id);
		categories = categories.filter((c) => c.id !== id);

		return HttpResponse.json({
			success: true,
			message: 'Kategori berhasil dihapus.',
			data: null
		});
	}),

	// ===== POSTS =====
	http.get('*/posts', async () => {
		await delay(500);
		return HttpResponse.json({
			success: true,
			message: 'OK',
			data: {
				items: posts,
				meta: { currentPage: 1, totalPages: 1, totalItems: posts.length, perPage: 20 }
			}
		});
	}),

	http.get('*/posts/:id', async ({ params }) => {
		await delay(300);
		const post = posts.find((p) => p.id === params.id);

		if (!post) {
			return HttpResponse.json(
				{ success: false, code: 'NOT_FOUND', message: 'Postingan tidak ditemukan.' },
				{ status: 404 }
			);
		}

		return HttpResponse.json({
			success: true,
			message: 'OK',
			data: post
		});
	}),

	http.post('*/posts', async ({ request }) => {
		await delay(600);
		const body = await request.json();
		const newPost = { ...(body as Record<string, unknown>), id: String(Date.now()) };
		posts.push(newPost as typeof posts[0]);

		return HttpResponse.json({
			success: true,
			message: 'Postingan berhasil dibuat.',
			data: newPost
		}, { status: 201 });
	}),

	http.put('*/posts/:id', async ({ params, request }) => {
		await delay(500);
		const id = params.id as string;
		const body = await request.json();
		const index = posts.findIndex((p) => p.id === id);

		if (index === -1) {
			return HttpResponse.json(
				{ success: false, code: 'NOT_FOUND', message: 'Postingan tidak ditemukan.' },
				{ status: 404 }
			);
		}

		posts[index] = { ...posts[index], ...(body as Record<string, unknown>) };

		return HttpResponse.json({
			success: true,
			message: 'Postingan berhasil diperbarui.',
			data: posts[index]
		});
	}),

	http.delete('*/posts/:id', async ({ params }) => {
		await delay(300);
		const id = params.id as string;
		posts = posts.filter((p) => p.id !== id);

		return HttpResponse.json({
			success: true,
			message: 'Postingan berhasil dihapus.',
			data: null
		});
	})
];
