import { Router } from 'express';
import { body } from 'express-validator';
import { commentController } from '../controllers/commentController';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validate';

const router = Router();

router.get('/post/:postId', commentController.getByPostId);

router.post(
  '/post/:postId',
  authenticate,
  [body('content').trim().notEmpty().withMessage('Comment content is required')],
  validate,
  commentController.create
);

router.delete('/:id', authenticate, commentController.delete);

export default router;
