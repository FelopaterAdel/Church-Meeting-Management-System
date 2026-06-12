import { Router } from 'express';
import { asyncHandler } from '../../middleware/async-handler.middleware.js';
import { authenticate } from '../../middleware/auth.middleware.js';
import { authorizeRoles } from '../../middleware/role.middleware.js';
import { validateRequest } from '../../middleware/validation.middleware.js';
import * as userController from './user.controller.js';
import { listServantsSchema, listUsersSchema, servantIdParamSchema, userIdParamSchema } from './user.validation.js';

export const userRoutes = Router();

userRoutes.use(authenticate);

userRoutes.get('/', validateRequest(listUsersSchema), asyncHandler(userController.listUsers));

userRoutes.patch(
  '/:id/approve',
  authorizeRoles('SUPER_ADMIN'),
  validateRequest(userIdParamSchema),
  asyncHandler(userController.approveUser)
);
userRoutes.patch(
  '/:id/reject',
  authorizeRoles('SUPER_ADMIN'),
  validateRequest(userIdParamSchema),
  asyncHandler(userController.rejectUser)
);
userRoutes.patch(
  '/:id/suspend',
  authorizeRoles('SUPER_ADMIN'),
  validateRequest(userIdParamSchema),
  asyncHandler(userController.suspendUser)
);
userRoutes.delete(
  '/:id',
  authorizeRoles('SUPER_ADMIN'),
  validateRequest(userIdParamSchema),
  asyncHandler(userController.removeUser)
);

userRoutes.get(
  '/servants',
  authorizeRoles('SUPER_ADMIN'),
  validateRequest(listServantsSchema),
  asyncHandler(userController.listServants)
);
userRoutes.get(
  '/servants/:id',
authenticate,
validateRequest(servantIdParamSchema),
  asyncHandler(userController.getServantById)
);
userRoutes.patch(
  '/servants/:id/approve',
  authorizeRoles('SUPER_ADMIN'),
  validateRequest(servantIdParamSchema),
  asyncHandler(userController.approveServant)
);
userRoutes.patch(
  '/servants/:id/reject',
  authorizeRoles('SUPER_ADMIN'),
  validateRequest(servantIdParamSchema),
  asyncHandler(userController.rejectServant)
);
userRoutes.patch(
  '/servants/:id/suspend',
  authorizeRoles('SUPER_ADMIN'),
  validateRequest(servantIdParamSchema),
  asyncHandler(userController.suspendServant)
);
userRoutes.patch(
  '/servants/:id/reactivate',
  authorizeRoles('SUPER_ADMIN'),
  validateRequest(servantIdParamSchema),
  asyncHandler(userController.reactivateServant)
);
