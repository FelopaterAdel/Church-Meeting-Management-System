import { z } from 'zod';
import { objectIdSchema, paginationQuerySchema } from '../../validation/common.validation.js';

export const qrAttendanceSchema = z.object({
  body: z.object({
    meetingId: objectIdSchema,
    qrCode: z.string().trim().min(1).max(250)
  })
});

export const manualAttendanceSchema = z.object({
  body: z.object({
    meetingId: objectIdSchema,
    studentId: objectIdSchema
  })
});

export const listStudentAttendanceSchema = z.object({
  params: z.object({
    studentId: objectIdSchema
  }),
  query: paginationQuerySchema.omit({ search: true })
});

export const listMeetingAttendanceSchema = z.object({
  params: z.object({
    meetingId: objectIdSchema
  }),
  query: paginationQuerySchema.omit({ search: true })
});

export type QrAttendanceInput = z.infer<typeof qrAttendanceSchema>['body'];
export type ManualAttendanceInput = z.infer<typeof manualAttendanceSchema>['body'];
export type ListAttendanceQuery = z.infer<typeof listStudentAttendanceSchema>['query'];
