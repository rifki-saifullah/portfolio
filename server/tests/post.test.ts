import { expect, test, describe, spyOn } from 'bun:test';
import { app } from '../src/app';
import { postRepository } from '../src/modules/post/post.repository';
import { generateAccessToken } from '../src/utils/paseto';

describe('Post Routes (/api/posts)', () => {
  test('GET /api/posts should return paginated list of posts', async () => {
    spyOn(postRepository, 'findAll').mockResolvedValue({
      items: [
        {
          id: 'post-1',
          chapter: { id: 'Bab 1', en: 'Chapter 1', ja: '第1章' },
          title: { id: 'Judul 1', en: 'Title 1', ja: 'タイトル 1' },
          category: 'Cerpen',
          date: '2025-06-01',
          contentBlocks: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ],
      meta: { currentPage: 1, totalPages: 1, totalItems: 1, perPage: 20 }
    });

    const res = await app.request('/api/posts');
    expect(res.status).toBe(200);

    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.data.items.length).toBe(1);
    expect(body.data.items[0].id).toBe('post-1');
  });

  test('POST /api/posts should create post when authenticated', async () => {
    spyOn(postRepository, 'create').mockResolvedValue({
      id: 'post-new-123',
      chapter: { id: 'Bab 1', en: 'Chapter 1', ja: '第1章' },
      title: { id: 'Judul Baru', en: 'New Title', ja: '新しいタイトル' },
      category: 'Cerpen',
      date: '2025-06-01',
      contentBlocks: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    const token = await generateAccessToken({
      id: 'admin-id',
      name: 'Admin',
      email: 'admin@example.com'
    });

    const res = await app.request('/api/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        chapter: { id: 'Bab 1', en: 'Chapter 1', ja: '第1章' },
        title: { id: 'Judul Baru', en: 'New Title', ja: '新しいタイトル' },
        category: 'Cerpen',
        date: '2025-06-01'
      })
    });

    expect(res.status).toBe(201);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.data.id).toBe('post-new-123');
  });
});
