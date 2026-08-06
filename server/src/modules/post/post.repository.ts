import { db } from '../../db';
import type { CreatePostInput, UpdatePostInput } from './post.schema';
import { deleteUploadFile } from '../../utils/file';

/** Return localized value with fallback to 'id' if empty */
function localize(obj: any, lang: string = 'id'): string {
  if (!obj) return '';
  return obj[lang] || obj['id'] || '';
}

function formatPost(p: any) {
  const title = p.title as any;
  return {
    id: p.id,
    title: {
      id: title?.id || '',
      en: title?.en || title?.id || '',
      ja: title?.ja || title?.id || ''
    },
    categoryId: p.categoryId,
    category: p.category
      ? {
          id: p.category.id,
          name: p.category.name as any
        }
      : null,
    isDraft: p.isDraft,
    youtubeId: p.youtubeId ?? undefined,
    contentBlocks: (p.contentBlocks ?? []).map((b: any) => ({
      id: b.id,
      type: b.type as 'paragraph' | 'code' | 'rich-text' | 'image',
      value: b.value as any
    })),
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString()
  };
}

export const postRepository = {
  async findAll(options: {
    page?: number;
    limit?: number;
    search?: string;
    categoryId?: number;
    isDraft?: boolean;
  }) {
    const page = options.page || 1;
    const limit = options.limit || 20;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (options.categoryId !== undefined) {
      where.categoryId = options.categoryId;
    }

    if (options.isDraft !== undefined) {
      where.isDraft = options.isDraft;
    }

    const [items, totalItems] = await Promise.all([
      db.post.findMany({
        where,
        include: {
          category: true,
          contentBlocks: { orderBy: { orderIndex: 'asc' } }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      db.post.count({ where })
    ]);

    return {
      items: items.map(formatPost),
      meta: {
        currentPage: page,
        totalPages: Math.ceil(totalItems / limit) || 1,
        totalItems,
        perPage: limit
      }
    };
  },

  async findById(id: string) {
    const p = await db.post.findUnique({
      where: { id },
      include: {
        category: true,
        contentBlocks: { orderBy: { orderIndex: 'asc' } }
      }
    });

    if (!p) return null;
    return formatPost(p);
  },

  async create(input: CreatePostInput) {
    const post = await db.post.create({
      data: {
        title: input.title,
        categoryId: input.categoryId,
        isDraft: input.isDraft ?? false,
        youtubeId: input.youtubeId || null,
        contentBlocks: {
          create: input.contentBlocks.map((b, idx) => ({
            type: b.type,
            value: b.value,
            orderIndex: idx
          }))
        }
      },
      include: {
        category: true,
        contentBlocks: { orderBy: { orderIndex: 'asc' } }
      }
    });

    return formatPost(post);
  },

  async update(id: string, input: UpdatePostInput) {
    const existing = await db.post.findUnique({
      where: { id },
      include: { contentBlocks: true }
    });
    if (!existing) return null;

    if (input.contentBlocks) {
      // Collect old image URLs
      const oldUrls = new Set<string>();
      for (const b of existing.contentBlocks) {
        if (b.type === 'image' && b.value) {
          const val = b.value as any;
          if (val.id) oldUrls.add(val.id);
          if (val.en) oldUrls.add(val.en);
          if (val.ja) oldUrls.add(val.ja);
        }
      }

      // Collect new image URLs
      const newUrls = new Set<string>();
      for (const b of input.contentBlocks) {
        if (b.type === 'image' && b.value) {
          const val = b.value as any;
          if (val.id) newUrls.add(val.id);
          if (val.en) newUrls.add(val.en);
          if (val.ja) newUrls.add(val.ja);
        }
      }

      // Delete storage files for images removed during update
      for (const oldUrl of oldUrls) {
        if (!newUrls.has(oldUrl)) {
          deleteUploadFile(oldUrl);
        }
      }

      await db.contentBlock.deleteMany({ where: { postId: id } });
    }

    const post = await db.post.update({
      where: { id },
      data: {
        ...(input.title && { title: input.title }),
        ...(input.categoryId !== undefined && { categoryId: input.categoryId }),
        ...(input.isDraft !== undefined && { isDraft: input.isDraft }),
        ...(input.youtubeId !== undefined && { youtubeId: input.youtubeId || null }),
        ...(input.contentBlocks && {
          contentBlocks: {
            create: input.contentBlocks.map((b, idx) => ({
              type: b.type,
              value: b.value,
              orderIndex: idx
            }))
          }
        })
      },
      include: {
        category: true,
        contentBlocks: { orderBy: { orderIndex: 'asc' } }
      }
    });

    return formatPost(post);
  },

  async delete(id: string) {
    const existing = await db.post.findUnique({
      where: { id },
      include: { contentBlocks: true }
    });
    if (!existing) return false;

    // Delete all associated image files from storage
    for (const b of existing.contentBlocks) {
      if (b.type === 'image' && b.value) {
        const val = b.value as any;
        const urls = [val.id, val.en, val.ja].filter((u) => typeof u === 'string');
        const uniqueUrls = Array.from(new Set(urls));
        uniqueUrls.forEach((u) => deleteUploadFile(u));
      }
    }

    await db.post.delete({ where: { id } });
    return true;
  }
};
