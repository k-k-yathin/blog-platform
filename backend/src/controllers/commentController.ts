import { Response, NextFunction } from 'express';
import { commentService } from '../services/commentService';
import { AuthRequest } from '../middleware/auth';
import { getParam } from '../utils/params';

export const commentController = {
  async getByPostId(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const comments = await commentService.getByPostId(getParam(req, 'postId'));
      res.status(200).json(comments);
    } catch (error) {
      next(error);
    }
  },

  async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const comment = await commentService.create(
        getParam(req, 'postId'),
        req.user!.id,
        req.body.content
      );
      res.status(201).json(comment);
    } catch (error) {
      next(error);
    }
  },

  async delete(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      await commentService.delete(getParam(req, 'id'), req.user!.id);
      res.status(200).json({ message: 'Comment deleted successfully' });
    } catch (error) {
      next(error);
    }
  },
};
