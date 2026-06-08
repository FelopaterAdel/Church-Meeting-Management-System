import { Router } from 'express';
import { asyncHandler } from '../../middleware/async-handler.middleware.js';
import { authenticate } from '../../middleware/auth.middleware.js';
import { authorizeRoles } from '../../middleware/role.middleware.js';
import { validateRequest } from '../../middleware/validation.middleware.js';
import * as stageController from './stage.controller.js';
import { createStageSchema, listStagesSchema, stageIdParamSchema, updateStageSchema } from './stage.validation.js';

export const stageRoutes = Router();

stageRoutes.use(authenticate);

stageRoutes.get('/', validateRequest(listStagesSchema), asyncHandler(stageController.listStages));
stageRoutes.get('/:id', validateRequest(stageIdParamSchema), asyncHandler(stageController.getStageById));

stageRoutes.post(
  '/',
  authorizeRoles('SUPER_ADMIN'),
  validateRequest(createStageSchema),
  asyncHandler(stageController.createStage)
);
stageRoutes.put(
  '/:id',
  authorizeRoles('SUPER_ADMIN'),
  validateRequest(updateStageSchema),
  asyncHandler(stageController.updateStage)
);
stageRoutes.delete(
  '/:id',
  authorizeRoles('SUPER_ADMIN'),
  validateRequest(stageIdParamSchema),
  asyncHandler(stageController.deleteStage)
);
