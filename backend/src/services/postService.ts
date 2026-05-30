import prisma from '../utils/prisma';
import { slugify, parsePagination } from '../utils/helpers';
import { AppError } from '../middleware/errorHandler';

interface PostFilters {
  search?: string;
  category?: string;
  tag?: string;
  featured?: boolean;
  page?: string;
  limit?: string;
  authorId?: string;
}

const postInclude = {
  author: { select: { id: true, name: true, email: true } },
  categories: { select: { id: true, name: true, slug: true } },
  tags: { select: { id: true, name: true, slug: true } },
  _count: { select: { comments: true } },
};

async function connectCategories(categoryNames?: string[]) {
  if (!categoryNames?.length) return {};

  const categories = await Promise.all(
    categoryNames.map(async (name) => {
      const slug = slugify(name);
      return prisma.category.upsert({
        where: { slug },
        update: {},
        create: { name, slug },
      });
    })
  );

  return { categories: { connect: categories.map((c) => ({ id: c.id })) } };
}

async function connectTags(tagNames?: string[]) {
  if (!tagNames?.length) return {};

  const tags = await Promise.all(
    tagNames.map(async (name) => {
      const slug = slugify(name);
      return prisma.tag.upsert({
        where: { slug },
        update: {},
        create: { name, slug },
      });
    })
  );

  return { tags: { connect: tags.map((t) => ({ id: t.id })) } };
}

export const postService = {
  async getAll(filters: PostFilters) {
    const { page, limit, skip } = parsePagination(filters.page, filters.limit);

    const where: Record<string, unknown> = {};

    if (!filters.authorId) {
      where.published = true;
    }

    if (filters.search) {
      where.OR = [
        { title: { contains: filters.search, mode: 'insensitive' } },
        { content: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    if (filters.category) {
      where.categories = { some: { slug: filters.category } };
    }

    if (filters.tag) {
      where.tags = { some: { slug: filters.tag } };
    }

    if (filters.featured) {
      where.featured = true;
    }

    if (filters.authorId) {
      where.authorId = filters.authorId;
    }

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        include: postInclude,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.post.count({ where }),
    ]);

    return {
      posts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  },

  async getFeatured(limit = 3) {
    return prisma.post.findMany({
      where: { published: true, featured: true },
      include: postInclude,
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  },

  async getById(id: string) {
    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        ...postInclude,
        comments: {
          include: {
            user: { select: { id: true, name: true } },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!post) {
      throw new AppError('Post not found', 404);
    }

    return post;
  },

  async create(
    authorId: string,
    data: {
      title: string;
      content: string;
      image?: string;
      published?: boolean;
      featured?: boolean;
      categories?: string[];
      tags?: string[];
    }
  ) {
    const categoryConnect = await connectCategories(data.categories);
    const tagConnect = await connectTags(data.tags);

    return prisma.post.create({
      data: {
        title: data.title,
        content: data.content,
        image: data.image,
        published: data.published ?? true,
        featured: data.featured ?? false,
        authorId,
        ...categoryConnect,
        ...tagConnect,
      },
      include: postInclude,
    });
  },

  async update(
    id: string,
    userId: string,
    data: {
      title?: string;
      content?: string;
      image?: string;
      published?: boolean;
      featured?: boolean;
      categories?: string[];
      tags?: string[];
    }
  ) {
    const post = await prisma.post.findUnique({ where: { id } });

    if (!post) {
      throw new AppError('Post not found', 404);
    }

    if (post.authorId !== userId) {
      throw new AppError('Not authorized to edit this post', 403);
    }

    const updateData: Record<string, unknown> = { ...data };
    delete updateData.categories;
    delete updateData.tags;

    if (data.categories) {
      const categories = await Promise.all(
        data.categories.map(async (name) => {
          const slug = slugify(name);
          return prisma.category.upsert({
            where: { slug },
            update: {},
            create: { name, slug },
          });
        })
      );
      updateData.categories = { set: categories.map((c) => ({ id: c.id })) };
    }

    if (data.tags) {
      const tags = await Promise.all(
        data.tags.map(async (name) => {
          const slug = slugify(name);
          return prisma.tag.upsert({
            where: { slug },
            update: {},
            create: { name, slug },
          });
        })
      );
      updateData.tags = { set: tags.map((t) => ({ id: t.id })) };
    }

    return prisma.post.update({
      where: { id },
      data: updateData,
      include: postInclude,
    });
  },

  async delete(id: string, userId: string) {
    const post = await prisma.post.findUnique({ where: { id } });

    if (!post) {
      throw new AppError('Post not found', 404);
    }

    if (post.authorId !== userId) {
      throw new AppError('Not authorized to delete this post', 403);
    }

    await prisma.post.delete({ where: { id } });
  },

  async getCategories() {
    return prisma.category.findMany({
      include: { _count: { select: { posts: true } } },
      orderBy: { name: 'asc' },
    });
  },

  async getTags() {
    return prisma.tag.findMany({
      include: { _count: { select: { posts: true } } },
      orderBy: { name: 'asc' },
    });
  },
};
