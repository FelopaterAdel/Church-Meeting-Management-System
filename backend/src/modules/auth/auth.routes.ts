import { Router } from 'express';
import * as authController from './auth.controller.js';
import { asyncHandler } from '../../middleware/async-handler.middleware.js';
import { authenticate } from '../../middleware/auth.middleware.js';
import { validateRequest } from '../../middleware/validation.middleware.js';
import { loginSchema, refreshTokenSchema, registerServantSchema } from './auth.validation.js';

export const authRoutes = Router();

authRoutes.post('/register', validateRequest(registerServantSchema), asyncHandler(authController.registerServant));
authRoutes.post('/login', validateRequest(loginSchema), asyncHandler(authController.login));
authRoutes.post('/refresh', validateRequest(refreshTokenSchema), asyncHandler(authController.refreshToken));
authRoutes.post('/logout', authenticate, asyncHandler(authController.logout));
authRoutes.get('/me', authenticate, asyncHandler(authController.getMe));
