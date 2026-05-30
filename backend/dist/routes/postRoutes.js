"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const postController_1 = require("../controllers/postController");
const auth_1 = require("../middleware/auth");
const validate_1 = require("../middleware/validate");
const router = (0, express_1.Router)();
router.get('/', postController_1.postController.getAll);
router.get('/featured', postController_1.postController.getFeatured);
router.get('/categories', postController_1.postController.getCategories);
router.get('/tags', postController_1.postController.getTags);
router.get('/my-posts', auth_1.authenticate, postController_1.postController.getMyPosts);
router.get('/:id', postController_1.postController.getById);
router.post('/', auth_1.authenticate, [
    (0, express_validator_1.body)('title').trim().notEmpty().withMessage('Title is required'),
    (0, express_validator_1.body)('content').trim().notEmpty().withMessage('Content is required'),
    (0, express_validator_1.body)('image').optional().isURL().withMessage('Image must be a valid URL'),
], validate_1.validate, postController_1.postController.create);
router.put('/:id', auth_1.authenticate, [
    (0, express_validator_1.body)('title').optional().trim().notEmpty().withMessage('Title cannot be empty'),
    (0, express_validator_1.body)('content').optional().trim().notEmpty().withMessage('Content cannot be empty'),
    (0, express_validator_1.body)('image').optional().isURL().withMessage('Image must be a valid URL'),
], validate_1.validate, postController_1.postController.update);
router.delete('/:id', auth_1.authenticate, postController_1.postController.delete);
exports.default = router;
