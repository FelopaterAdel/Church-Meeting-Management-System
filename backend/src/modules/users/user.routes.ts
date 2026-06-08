import { Router } from 'express';
import { asyncHandler } from '../../middleware/async-handler.middleware.js';
import { authenticate } from '../../middleware/auth.middleware.js';
import { authorizeRoles } from '../../middleware/role.middleware.js';
import { validateRequest } from '../../middleware/validation.middleware.js';
import * as userController from './user.controller.js';
import { listServantsSchema, servantIdParamSchema } from './user.validation.js';

export const userRoutes = Router();

userRoutes.use(authenticate, authorizeRoles('SUPER_ADMIN'));

userRoutes.get('/servants', validateRequest(listServantsSchema), asyncHandler(userController.listServants));
userRoutes.get('/servants/:id', validateRequest(servantIdParamSchema), asyncHandler(userController.getServantById));
userRoutes.patch(
  '/servants/:id/approve',
  validateRequest(servantIdParamSchema),
  asyncHandler(userController.approveServant)
);
userRoutes.patch(
  '/servants/:id/reject',
  validateRequest(servantIdParamSchema),
  asyncHandler(userController.rejectServant)
);
userRoutes.patch(
  '/servants/:id/suspend',
  validateRequest(servantIdParamSchema),
  asyncHandler(userController.suspendServant)
);
userRoutes.patch(
  '/servants/:id/reactivate',
  validateRequest(servantIdParamSchema),
  asyncHandler(userController.reactivateServant)
);
