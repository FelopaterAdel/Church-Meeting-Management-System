import { Router } from 'express';
import { asyncHandler } from '../../middleware/async-handler.middleware.js';
import { authenticate } from '../../middleware/auth.middleware.js';
import { authorizeRoles } from '../../middleware/role.middleware.js';
import { validateRequest } from '../../middleware/validation.middleware.js';
import * as studentController from './student.controller.js';
import {
  createStudentSchema,
  listStudentsSchema,
  studentIdParamSchema,
  updateStudentSchema
} from './student.validation.js';

export const studentRoutes = Router();

studentRoutes.use(authenticate);

studentRoutes.get('/', validateRequest(listStudentsSchema), asyncHandler(studentController.listStudents));
studentRoutes.get('/:id', validateRequest(studentIdParamSchema), asyncHandler(studentController.getStudentById));

studentRoutes.post(
  '/',
  authorizeRoles('SUPER_ADMIN'),
  validateRequest(createStudentSchema),
  asyncHandler(studentController.createStudent)
);
studentRoutes.put(
  '/:id',
  authorizeRoles('SUPER_ADMIN'),
  validateRequest(updateStudentSchema),
  asyncHandler(studentController.updateStudent)
);
studentRoutes.delete(
  '/:id',
  authorizeRoles('SUPER_ADMIN'),
  validateRequest(studentIdParamSchema),
  asyncHandler(studentController.softDeleteStudent)
);
