"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = void 0;
const authService_1 = require("../services/authService");
exports.authController = {
    async register(req, res, next) {
        try {
            const { name, email, password } = req.body;
            const result = await authService_1.authService.register(name, email, password);
            res.status(201).json(result);
        }
        catch (error) {
            next(error);
        }
    },
    async login(req, res, next) {
        try {
            const { email, password } = req.body;
            const result = await authService_1.authService.login(email, password);
            res.status(200).json(result);
        }
        catch (error) {
            next(error);
        }
    },
    async logout(_req, res) {
        res.status(200).json({ message: 'Logged out successfully' });
    },
    async getProfile(req, res, next) {
        try {
            const profile = await authService_1.authService.getProfile(req.user.id);
            res.status(200).json(profile);
        }
        catch (error) {
            next(error);
        }
    },
};
