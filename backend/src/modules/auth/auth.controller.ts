import { StatusCodes } from 'http-status-codes';
import type { Request, Response } from 'express';
import { sendSuccess } from '../../utils/response.util.js';
import * as authService from './auth.service.js';

export const registerServant = async (req: Request, res: Response): Promise<void> => {
  console.log(req.body);
  const user = await authService.registerServant(req.body);

  sendSuccess(res, {
    statusCode: StatusCodes.CREATED,
    message: 'Registration submitted and pending approval',
    data: { user }
  });
};

export const login = async (req: Request, res: Response): Promise<void> => {
  const result = await authService.login(req.body);

  sendSuccess(res, {
    statusCode: StatusCodes.OK,
    message: 'Login successful',
    data: result
  });
};

export const logout = async (_req: Request, res: Response): Promise<void> => {
  sendSuccess(res, {
    statusCode: StatusCodes.OK,
    message: 'Logout successful'
  });
};

export const refreshToken = async (req: Request, res: Response): Promise<void> => {
  const result = await authService.refreshToken(req.body);

  sendSuccess(res, {
    statusCode: StatusCodes.OK,
    message: 'Token refreshed successfully',
    data: result
  });
};

export const getMe = async (req: Request, res: Response): Promise<void> => {
  const user = await authService.getAuthenticatedUser(req.user!.id);

  sendSuccess(res, {
    statusCode: StatusCodes.OK,
    message: 'Authenticated user retrieved',
    data: { user }
  });
};
