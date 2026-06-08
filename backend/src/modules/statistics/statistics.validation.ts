import { z } from 'zod';
import { objectIdSchema } from '../../validation/common.validation.js';

const dateRangeQuerySchema = z.object({
  fromDate: z.coerce.date().optional(),
  toDate: z.coerce.date().optional(),
  stageId: objectIdSchema.optional()
});

export const dashboardStatisticsSchema = z.object({
  query: dateRangeQuerySchema
});

export const studentRankingReportSchema = z.object({
  query: dateRangeQuerySchema.extend({
    limit: z.coerce.number().int().positive().max(100).default(10)
  })
});

export const stageAttendanceReportSchema = z.object({
  query: dateRangeQuerySchema.omit({ stageId: true })
});

export type DashboardStatisticsQuery = z.infer<typeof dashboardStatisticsSchema>['query'];
export type StudentRankingReportQuery = z.infer<typeof studentRankingReportSchema>['query'];
export type StageAttendanceReportQuery = z.infer<typeof stageAttendanceReportSchema>['query'];
