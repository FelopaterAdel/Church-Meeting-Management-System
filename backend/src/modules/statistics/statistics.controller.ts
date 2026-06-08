import { StatusCodes } from 'http-status-codes';
import type { Request, Response } from 'express';
import { sendSuccess } from '../../utils/response.util.js';
import * as statisticsService from './statistics.service.js';
import type {
  DashboardStatisticsQuery,
  StageAttendanceReportQuery,
  StudentRankingReportQuery
} from './statistics.validation.js';

export const getDashboardStatistics = async (req: Request, res: Response): Promise<void> => {
  const statistics = await statisticsService.getDashboardStatistics(req.query as unknown as DashboardStatisticsQuery);

  sendSuccess(res, {
    statusCode: StatusCodes.OK,
    message: 'Dashboard statistics retrieved successfully',
    data: { statistics }
  });
};

export const getMostActiveStudents = async (req: Request, res: Response): Promise<void> => {
  const students = await statisticsService.getMostActiveStudents(req.query as unknown as StudentRankingReportQuery);

  sendSuccess(res, {
    statusCode: StatusCodes.OK,
    message: 'Most active students report retrieved successfully',
    data: { students }
  });
};

export const getMostAbsentStudents = async (req: Request, res: Response): Promise<void> => {
  const students = await statisticsService.getMostAbsentStudents(req.query as unknown as StudentRankingReportQuery);

  sendSuccess(res, {
    statusCode: StatusCodes.OK,
    message: 'Most absent students report retrieved successfully',
    data: { students }
  });
};

export const getStageAttendanceReport = async (req: Request, res: Response): Promise<void> => {
  const stages = await statisticsService.getStageAttendanceReport(req.query as unknown as StageAttendanceReportQuery);

  sendSuccess(res, {
    statusCode: StatusCodes.OK,
    message: 'Stage attendance report retrieved successfully',
    data: { stages }
  });
};
