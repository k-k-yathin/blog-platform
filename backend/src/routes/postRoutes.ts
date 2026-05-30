import { Router } from 'express';
import { body } from 'express-validator';
import { postController } from '../controllers/postController';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validate';

const router = Router();

router.get('/', postController.getAll);
router.get('/featured', postController.getFeatured);
router.get('/categories', postController.getCategories);
router.get('/tags', postController.getTags);
router.get('/my-posts', authenticate, postController.getMyPosts);
router.get('/:id', postController.getById);

router.post(
  '/',
  authenticate,
  [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('content').trim().notEmpty().withMessage('Content is required'),
    body('image').optional().isURL().withMessage('Image must be a valid URL'),
  ],
  validate,
  postController.create
);

router.put(
  '/:id',
  authenticate,
  [
    body('title').optional().trim().notEmpty().withMessage('Title cannot be empty'),
    body('content').optional().trim().notEmpty().withMessage('Content cannot be empty'),
    body('image').optional().isURL().withMessage('Image must be a valid URL'),
  ],
  validate,
  postController.update
);

router.delete('/:id', authenticate, postController.delete);

export default router;
