import type { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { UserModel } from '../modules/users/user.model.js';
import { AppError } from '../utils/app-error.util.js';
import { verifyAccessToken } from '../utils/token.util.js';

const getBearerToken = (authorizationHeader?: string): string => {
  if (!authorizationHeader?.startsWith('Bearer ')) {
    throw new AppError('Authentication token is required', StatusCodes.UNAUTHORIZED);
  }

  return authorizationHeader.slice('Bearer '.length).trim();
};

export const authenticate = async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
  try {
    const token = getBearerToken(req.headers.authorization);
    const payload = verifyAccessToken(token);

    const user = await UserModel.findById(payload.sub).select('_id role status isActive');

    if (!user || !user.isActive) {
      throw new AppError('Authentication token is invalid', StatusCodes.UNAUTHORIZED);
    }

    if (user.status !== 'APPROVED') {
      throw new AppError(`Account is ${user.status.toLowerCase()}`, StatusCodes.FORBIDDEN);
    }

    req.user = {
      id: user.id,
      role: user.role,
      status: user.status
    };

    next();
  } catch (error) {
    next(error);
  }
};
