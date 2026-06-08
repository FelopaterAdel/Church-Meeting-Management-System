import { Router } from 'express';
import { asyncHandler } from '../../middleware/async-handler.middleware.js';
import { authenticate } from '../../middleware/auth.middleware.js';
import { validateRequest } from '../../middleware/validation.middleware.js';
import * as visitController from './visit.controller.js';
import {
  createVisitSchema,
  listStudentVisitsSchema,
  updateVisitSchema,
  visitIdParamSchema
} from './visit.validation.js';

export const visitRoutes = Router();

visitRoutes.use(authenticate);

visitRoutes.get(
  '/students/:studentId',
  validateRequest(listStudentVisitsSchema),
  asyncHandler(visitController.listStudentVisits)
);
visitRoutes.post('/', validateRequest(createVisitSchema), asyncHandler(visitController.createVisit));
visitRoutes.put('/:id', validateRequest(updateVisitSchema), asyncHandler(visitController.updateVisit));
visitRoutes.delete('/:id', validateRequest(visitIdParamSchema), asyncHandler(visitController.deleteVisit));
