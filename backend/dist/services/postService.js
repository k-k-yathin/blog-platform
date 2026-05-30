"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postService = void 0;
const prisma_1 = __importDefault(require("../utils/prisma"));
const helpers_1 = require("../utils/helpers");
const errorHandler_1 = require("../middleware/errorHandler");
const postInclude = {
    author: { select: { id: true, name: true, email: true } },
    categories: { select: { id: true, name: true, slug: true } },
    tags: { select: { id: true, name: true, slug: true } },
    _count: { select: { comments: true } },
};
async function connectCategories(categoryNames) {
    if (!categoryNames?.length)
        return {};
    const categories = await Promise.all(categoryNames.map(async (name) => {
        const slug = (0, helpers_1.slugify)(name);
        return prisma_1.default.category.upsert({
            where: { slug },
            update: {},
            create: { name, slug },
        });
    }));
    return { categories: { connect: categories.map((c) => ({ id: c.id })) } };
}
async function connectTags(tagNames) {
    if (!tagNames?.length)
        return {};
    const tags = await Promise.all(tagNames.map(async (name) => {
        const slug = (0, helpers_1.slugify)(name);
        return prisma_1.default.tag.upsert({
            where: { slug },
            update: {},
            create: { name, slug },
        });
    }));
    return { tags: { connect: tags.map((t) => ({ id: t.id })) } };
}
exports.postService = {
    async getAll(filters) {
        const { page, limit, skip } = (0, helpers_1.parsePagination)(filters.page, filters.limit);
        const where = {};
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
            prisma_1.default.post.findMany({
                where,
                include: postInclude,
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
            }),
            prisma_1.default.post.count({ where }),
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
        return prisma_1.default.post.findMany({
            where: { published: true, featured: true },
            include: postInclude,
            orderBy: { createdAt: 'desc' },
            take: limit,
        });
    },
    async getById(id) {
        const post = await prisma_1.default.post.findUnique({
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
            throw new errorHandler_1.AppError('Post not found', 404);
        }
        return post;
    },
    async create(authorId, data) {
        const categoryConnect = await connectCategories(data.categories);
        const tagConnect = await connectTags(data.tags);
        return prisma_1.default.post.create({
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
    async update(id, userId, data) {
        const post = await prisma_1.default.post.findUnique({ where: { id } });
        if (!post) {
            throw new errorHandler_1.AppError('Post not found', 404);
        }
        if (post.authorId !== userId) {
            throw new errorHandler_1.AppError('Not authorized to edit this post', 403);
        }
        const updateData = { ...data };
        delete updateData.categories;
        delete updateData.tags;
        if (data.categories) {
            const categories = await Promise.all(data.categories.map(async (name) => {
                const slug = (0, helpers_1.slugify)(name);
                return prisma_1.default.category.upsert({
                    where: { slug },
                    update: {},
                    create: { name, slug },
                });
            }));
            updateData.categories = { set: categories.map((c) => ({ id: c.id })) };
        }
        if (data.tags) {
            const tags = await Promise.all(data.tags.map(async (name) => {
                const slug = (0, helpers_1.slugify)(name);
                return prisma_1.default.tag.upsert({
                    where: { slug },
                    update: {},
                    create: { name, slug },
                });
            }));
            updateData.tags = { set: tags.map((t) => ({ id: t.id })) };
        }
        return prisma_1.default.post.update({
            where: { id },
            data: updateData,
            include: postInclude,
        });
    },
    async delete(id, userId) {
        const post = await prisma_1.default.post.findUnique({ where: { id } });
        if (!post) {
            throw new errorHandler_1.AppError('Post not found', 404);
        }
        if (post.authorId !== userId) {
            throw new errorHandler_1.AppError('Not authorized to delete this post', 403);
        }
        await prisma_1.default.post.delete({ where: { id } });
    },
    async getCategories() {
        return prisma_1.default.category.findMany({
            include: { _count: { select: { posts: true } } },
            orderBy: { name: 'asc' },
        });
    },
    async getTags() {
        return prisma_1.default.tag.findMany({
            include: { _count: { select: { posts: true } } },
            orderBy: { name: 'asc' },
        });
    },
};
