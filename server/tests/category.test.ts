import { expect, test, describe, spyOn } from 'bun:test';
import { app } from '../src/app';
import { categoryRepository } from '../src/modules/category/category.repository';
import { generateAccessToken } from '../src/utils/paseto';

describe('Category Routes (/api/categories)', () => {
  test('GET /api/categories should return list of categories', async () => {
    spyOn(categoryRepository, 'findAll').mockResolvedValue([
      { id: 1, name: { id: 'Cerpen', en: 'Short Story', ja: '短編小説' }, createdAt: new Date(), updatedAt: new Date() }
    ]);

    const res = await app.request('/api/categories');
    expect(res.status).toBe(200);

    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.data.items.length).toBe(1);
    expect(body.data.items[0].name.id).toBe('Cerpen');
  });

  test('POST /api/categories should reject unauthenticated user', async () => {
    const res = await app.request('/api/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: { id: 'Novel', en: 'Novel', ja: '小説' } })
    });

    expect(res.status).toBe(401);
  });

  test('POST /api/categories should create category when authenticated', async () => {
    spyOn(categoryRepository, 'create').mockResolvedValue({
      id: 2,
      name: { id: 'Novel', en: 'Novel', ja: '小説' },
      createdAt: new Date(),
      updatedAt: new Date()
    });

    const token = await generateAccessToken({
      id: 'admin-id',
      name: 'Admin',
      email: 'admin@example.com'
    });

    const res = await app.request('/api/categories', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ name: { id: 'Novel', en: 'Novel', ja: '小説' } })
    });

    expect(res.status).toBe(201);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.data.id).toBe(2);
  });
});
