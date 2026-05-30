"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parsePagination = exports.slugify = void 0;
const slugify = (text) => {
    return text
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
};
exports.slugify = slugify;
const parsePagination = (page, limit) => {
    const pageNum = Math.max(1, parseInt(page || '1', 10) || 1);
    const limitNum = Math.min(50, Math.max(1, parseInt(limit || '10', 10) || 10));
    const skip = (pageNum - 1) * limitNum;
    return { page: pageNum, limit: limitNum, skip };
};
exports.parsePagination = parsePagination;
