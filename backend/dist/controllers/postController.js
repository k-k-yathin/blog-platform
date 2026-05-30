"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postController = void 0;
const postService_1 = require("../services/postService");
const params_1 = require("../utils/params");
exports.postController = {
    async getAll(req, res, next) {
        try {
            const { search, category, tag, featured, page, limit } = req.query;
            const result = await postService_1.postService.getAll({
                search: search,
                category: category,
                tag: tag,
                featured: featured === 'true',
                page: page,
                limit: limit,
            });
            res.status(200).json(result);
        }
        catch (error) {
            next(error);
        }
    },
    async getFeatured(_req, res, next) {
        try {
            const posts = await postService_1.postService.getFeatured();
            res.status(200).json(posts);
        }
        catch (error) {
            next(error);
        }
    },
    async getById(req, res, next) {
        try {
            const post = await postService_1.postService.getById((0, params_1.getParam)(req, 'id'));
            res.status(200).json(post);
        }
        catch (error) {
            next(error);
        }
    },
    async create(req, res, next) {
        try {
            const post = await postService_1.postService.create(req.user.id, req.body);
            res.status(201).json(post);
        }
        catch (error) {
            next(error);
        }
    },
    async update(req, res, next) {
        try {
            const post = await postService_1.postService.update((0, params_1.getParam)(req, 'id'), req.user.id, req.body);
            res.status(200).json(post);
        }
        catch (error) {
            next(error);
        }
    },
    async delete(req, res, next) {
        try {
            await postService_1.postService.delete((0, params_1.getParam)(req, 'id'), req.user.id);
            res.status(200).json({ message: 'Post deleted successfully' });
        }
        catch (error) {
            next(error);
        }
    },
    async getMyPosts(req, res, next) {
        try {
            const { page, limit } = req.query;
            const result = await postService_1.postService.getAll({
                authorId: req.user.id,
                page: page,
                limit: limit,
            });
            res.status(200).json(result);
        }
        catch (error) {
            next(error);
        }
    },
    async getCategories(_req, res, next) {
        try {
            const categories = await postService_1.postService.getCategories();
            res.status(200).json(categories);
        }
        catch (error) {
            next(error);
        }
    },
    async getTags(_req, res, next) {
        try {
            const tags = await postService_1.postService.getTags();
            res.status(200).json(tags);
        }
        catch (error) {
            next(error);
        }
    },
};
