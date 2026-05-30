import { Response, NextFunction } from 'express';
import { postService } from '../services/postService';
import { AuthRequest } from '../middleware/auth';
import { getParam } from '../utils/params';

export const postController = {
  async getAll(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { search, category, tag, featured, page, limit } = req.query;
      const result = await postService.getAll({
        search: search as string,
        category: category as string,
        tag: tag as string,
        featured: featured === 'true',
        page: page as string,
        limit: limit as string,
      });
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  },

  async getFeatured(_req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const posts = await postService.getFeatured();
      res.status(200).json(posts);
    } catch (error) {
      next(error);
    }
  },

  async getById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const post = await postService.getById(getParam(req, 'id'));
      res.status(200).json(post);
    } catch (error) {
      next(error);
    }
  },

  async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const post = await postService.create(req.user!.id, req.body);
      res.status(201).json(post);
    } catch (error) {
      next(error);
    }
  },

  async update(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const post = await postService.update(getParam(req, 'id'), req.user!.id, req.body);
      res.status(200).json(post);
    } catch (error) {
      next(error);
    }
  },

  async delete(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      await postService.delete(getParam(req, 'id'), req.user!.id);
      res.status(200).json({ message: 'Post deleted successfully' });
    } catch (error) {
      next(error);
    }
  },

  async getMyPosts(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { page, limit } = req.query;
      const result = await postService.getAll({
        authorId: req.user!.id,
        page: page as string,
        limit: limit as string,
      });
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  },

  async getCategories(_req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const categories = await postService.getCategories();
      res.status(200).json(categories);
    } catch (error) {
      next(error);
    }
  },

  async getTags(_req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const tags = await postService.getTags();
      res.status(200).json(tags);
    } catch (error) {
      next(error);
    }
  },
};
