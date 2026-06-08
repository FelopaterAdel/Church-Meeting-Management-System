import { StatusCodes } from 'http-status-codes';
import type { Request, Response } from 'express';
import { sendSuccess } from '../../utils/response.util.js';
import * as attendanceService from './attendance.service.js';
import type {
  ListAttendanceQuery,
  ManualAttendanceInput,
  QrAttendanceInput
} from './attendance.validation.js';

type StudentIdParams = {
  studentId: string;
};

type MeetingIdParams = {
  meetingId: string;
};

export const markAttendanceByQrCode = async (req: Request, res: Response): Promise<void> => {
  const attendance = await attendanceService.markAttendanceByQrCode(req.body as QrAttendanceInput, req.user!.id);

  sendSuccess(res, {
    statusCode: StatusCodes.CREATED,
    message: 'Attendance recorded successfully',
    data: { attendance }
  });
};

export const markManualAttendance = async (req: Request, res: Response): Promise<void> => {
  const attendance = await attendanceService.markManualAttendance(req.body as ManualAttendanceInput, req.user!.id);

  sendSuccess(res, {
    statusCode: StatusCodes.CREATED,
    message: 'Attendance recorded successfully',
    data: { attendance }
  });
};

export const listStudentAttendance = async (req: Request, res: Response): Promise<void> => {
  const result = await attendanceService.listStudentAttendance(
    (req.params as StudentIdParams).studentId,
    req.query as unknown as ListAttendanceQuery
  );

  sendSuccess(res, {
    statusCode: StatusCodes.OK,
    message: 'Student attendance retrieved successfully',
    data: {
      attendance: result.attendance
    },
    meta: {
      pagination: result.pagination
    }
  });
};

export const listMeetingAttendance = async (req: Request, res: Response): Promise<void> => {
  const result = await attendanceService.listMeetingAttendance(
    (req.params as MeetingIdParams).meetingId,
    req.query as unknown as ListAttendanceQuery
  );

  sendSuccess(res, {
    statusCode: StatusCodes.OK,
    message: 'Meeting attendance retrieved successfully',
    data: {
      attendance: result.attendance
    },
    meta: {
      pagination: result.pagination
    }
  });
};
