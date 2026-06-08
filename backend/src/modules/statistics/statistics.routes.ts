import { Router } from 'express';
import { asyncHandler } from '../../middleware/async-handler.middleware.js';
import { authenticate } from '../../middleware/auth.middleware.js';
import { validateRequest } from '../../middleware/validation.middleware.js';
import * as statisticsController from './statistics.controller.js';
import {
  dashboardStatisticsSchema,
  stageAttendanceReportSchema,
  studentRankingReportSchema
} from './statistics.validation.js';

export const statisticsRoutes = Router();

statisticsRoutes.use(authenticate);

statisticsRoutes.get(
  '/dashboard',
  validateRequest(dashboardStatisticsSchema),
  asyncHandler(statisticsController.getDashboardStatistics)
);
statisticsRoutes.get(
  '/reports/most-active-students',
  validateRequest(studentRankingReportSchema),
  asyncHandler(statisticsController.getMostActiveStudents)
);
statisticsRoutes.get(
  '/reports/most-absent-students',
  validateRequest(studentRankingReportSchema),
  asyncHandler(statisticsController.getMostAbsentStudents)
);
statisticsRoutes.get(
  '/reports/stage-attendance',
  validateRequest(stageAttendanceReportSchema),
  asyncHandler(statisticsController.getStageAttendanceReport)
);
