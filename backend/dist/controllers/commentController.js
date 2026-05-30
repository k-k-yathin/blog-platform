"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.commentController = void 0;
const commentService_1 = require("../services/commentService");
const params_1 = require("../utils/params");
exports.commentController = {
    async getByPostId(req, res, next) {
        try {
            const comments = await commentService_1.commentService.getByPostId((0, params_1.getParam)(req, 'postId'));
            res.status(200).json(comments);
        }
        catch (error) {
            next(error);
        }
    },
    async create(req, res, next) {
        try {
            const comment = await commentService_1.commentService.create((0, params_1.getParam)(req, 'postId'), req.user.id, req.body.content);
            res.status(201).json(comment);
        }
        catch (error) {
            next(error);
        }
    },
    async delete(req, res, next) {
        try {
            await commentService_1.commentService.delete((0, params_1.getParam)(req, 'id'), req.user.id);
            res.status(200).json({ message: 'Comment deleted successfully' });
        }
        catch (error) {
            next(error);
        }
    },
};
