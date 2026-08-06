import { db } from '../../db';

export const categoryRepository = {
  async findAll() {
    return db.category.findMany({
      orderBy: { id: 'asc' },
      include: {
        _count: {
          select: { posts: true }
        }
      }
    });
  },

  async findPaginated(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    const [items, totalItems] = await Promise.all([
      db.category.findMany({
        orderBy: { id: 'asc' },
        include: {
          _count: {
            select: { posts: true }
          }
        },
        skip,
        take: limit
      }),
      db.category.count()
    ]);

    const totalPages = Math.ceil(totalItems / limit) || 1;

    return {
      items,
      meta: {
        currentPage: page,
        totalPages,
        totalItems,
        perPage: limit
      }
    };
  },

  async findById(id: number) {
    return db.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: { posts: true }
        }
      }
    });
  },

  async countPosts(id: number) {
    return db.post.count({
      where: { categoryId: id }
    });
  },

  async create(name: Record<string, string>) {
    return db.category.create({
      data: { name }
    });
  },

  async update(id: number, name: Record<string, string>) {
    return db.category.update({
      where: { id },
      data: { name }
    });
  },

  async delete(id: number) {
    return db.category.delete({
      where: { id }
    });
  }
};
