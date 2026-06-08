import type { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import type { UserRole } from '../types/roles.js';
import { AppError } from '../utils/app-error.util.js';

export const authorizeRoles =
  (...allowedRoles: UserRole[]) =>
  (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      next(new AppError('Authentication is required', StatusCodes.UNAUTHORIZED));
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      next(new AppError('You do not have permission to access this resource', StatusCodes.FORBIDDEN));
      return;
    }

    next();
  };
