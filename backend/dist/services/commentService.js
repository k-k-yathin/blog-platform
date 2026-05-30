"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.commentService = void 0;
const prisma_1 = __importDefault(require("../utils/prisma"));
const errorHandler_1 = require("../middleware/errorHandler");
exports.commentService = {
    async getByPostId(postId) {
        const post = await prisma_1.default.post.findUnique({ where: { id: postId } });
        if (!post) {
            throw new errorHandler_1.AppError('Post not found', 404);
        }
        return prisma_1.default.comment.findMany({
            where: { postId },
            include: {
                user: { select: { id: true, name: true } },
            },
            orderBy: { createdAt: 'desc' },
        });
    },
    async create(postId, userId, content) {
        const post = await prisma_1.default.post.findUnique({ where: { id: postId } });
        if (!post) {
            throw new errorHandler_1.AppError('Post not found', 404);
        }
        return prisma_1.default.comment.create({
            data: { content, postId, userId },
            include: {
                user: { select: { id: true, name: true } },
            },
        });
    },
    async delete(id, userId) {
        const comment = await prisma_1.default.comment.findUnique({ where: { id } });
        if (!comment) {
            throw new errorHandler_1.AppError('Comment not found', 404);
        }
        if (comment.userId !== userId) {
            throw new errorHandler_1.AppError('Not authorized to delete this comment', 403);
        }
        await prisma_1.default.comment.delete({ where: { id } });
    },
};
