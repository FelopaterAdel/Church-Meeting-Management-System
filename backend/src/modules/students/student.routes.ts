import { Router } from 'express';
import { asyncHandler } from '../../middleware/async-handler.middleware.js';
import { authenticate } from '../../middleware/auth.middleware.js';
import { validateRequest } from '../../middleware/validation.middleware.js';
import * as studentController from './student.controller.js';
import {
  createStudentSchema,
  listStudentsSchema,
  studentQrCodeParamSchema,
  studentIdParamSchema,
  updateStudentSchema
} from './student.validation.js';

export const studentRoutes = Router();

studentRoutes.use(authenticate);

studentRoutes.get('/', validateRequest(listStudentsSchema), asyncHandler(studentController.listStudents));
studentRoutes.get('/qr/:qrCode',validateRequest(studentQrCodeParamSchema),asyncHandler(studentController.resolveStudentByQrCode)
);
studentRoutes.get('/:id/qrcode', validateRequest(studentIdParamSchema), asyncHandler(studentController.getStudentQrImage));
studentRoutes.get('/:id/qr', validateRequest(studentIdParamSchema), asyncHandler(studentController.getStudentQrData));
studentRoutes.get('/:id', validateRequest(studentIdParamSchema), asyncHandler(studentController.getStudentById));

studentRoutes.post(
  '/',
  authenticate,
  validateRequest(createStudentSchema),
  asyncHandler(studentController.createStudent)
);
studentRoutes.put(
  '/:id',
  authenticate,
  validateRequest(updateStudentSchema),
  asyncHandler(studentController.updateStudent)
);
studentRoutes.delete(
  '/:id',
  authenticate,
  validateRequest(studentIdParamSchema),
  asyncHandler(studentController.softDeleteStudent)
);
