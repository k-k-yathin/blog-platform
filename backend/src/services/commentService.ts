import prisma from '../utils/prisma';
import { AppError } from '../middleware/errorHandler';

export const commentService = {
  async getByPostId(postId: string) {
    const post = await prisma.post.findUnique({ where: { id: postId } });

    if (!post) {
      throw new AppError('Post not found', 404);
    }

    return prisma.comment.findMany({
      where: { postId },
      include: {
        user: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  },

  async create(postId: string, userId: string, content: string) {
    const post = await prisma.post.findUnique({ where: { id: postId } });

    if (!post) {
      throw new AppError('Post not found', 404);
    }

    return prisma.comment.create({
      data: { content, postId, userId },
      include: {
        user: { select: { id: true, name: true } },
      },
    });
  },

  async delete(id: string, userId: string) {
    const comment = await prisma.comment.findUnique({ where: { id } });

    if (!comment) {
      throw new AppError('Comment not found', 404);
    }

    if (comment.userId !== userId) {
      throw new AppError('Not authorized to delete this comment', 403);
    }

    await prisma.comment.delete({ where: { id } });
  },
};
