import { Router } from 'express';
import { asyncHandler } from '../../middleware/async-handler.middleware.js';
import { authenticate } from '../../middleware/auth.middleware.js';
import { validateRequest } from '../../middleware/validation.middleware.js';
import * as attendanceController from './attendance.controller.js';
import {
  listMeetingAttendanceSchema,
  listStudentAttendanceSchema,
  manualAttendanceSchema,
  qrAttendanceSchema
} from './attendance.validation.js';

export const attendanceRoutes = Router();

attendanceRoutes.use(authenticate);

attendanceRoutes.post(
  '/qr',
  validateRequest(qrAttendanceSchema),
  asyncHandler(attendanceController.markAttendanceByQrCode)
);
attendanceRoutes.post(
  '/manual',
  validateRequest(manualAttendanceSchema),
  asyncHandler(attendanceController.markManualAttendance)
);
attendanceRoutes.get(
  '/students/:studentId',
  validateRequest(listStudentAttendanceSchema),
  asyncHandler(attendanceController.listStudentAttendance)
);
attendanceRoutes.get(
  '/meetings/:meetingId',
  validateRequest(listMeetingAttendanceSchema),
  asyncHandler(attendanceController.listMeetingAttendance)
);
