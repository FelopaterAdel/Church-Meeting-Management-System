import { StatusCodes } from 'http-status-codes';
import type { Request, Response } from 'express';
import { sendSuccess } from '../../utils/response.util.js';
import * as visitService from './visit.service.js';
import type { CreateVisitInput, ListStudentVisitsQuery, UpdateVisitInput } from './visit.validation.js';

type IdParams = {
  id: string;
};

type StudentIdParams = {
  studentId: string;
};

const getVisitId = (req: Request): string => {
  return (req.params as IdParams).id;
};

const getStudentId = (req: Request): string => {
  return (req.params as StudentIdParams).studentId;
};

export const createVisit = async (req: Request, res: Response): Promise<void> => {
  const visit = await visitService.createVisit(req.body as CreateVisitInput, req.user!);

  sendSuccess(res, {
    statusCode: StatusCodes.CREATED,
    message: 'Visit added successfully',
    data: { visit }
  });
};

export const updateVisit = async (req: Request, res: Response): Promise<void> => {
  const visit = await visitService.updateVisit(getVisitId(req), req.body as UpdateVisitInput, req.user!);

  sendSuccess(res, {
    statusCode: StatusCodes.OK,
    message: 'Visit updated successfully',
    data: { visit }
  });
};

export const deleteVisit = async (req: Request, res: Response): Promise<void> => {
  await visitService.softDeleteVisit(getVisitId(req), req.user!);

  sendSuccess(res, {
    statusCode: StatusCodes.OK,
    message: 'Visit deleted successfully'
  });
};

export const listStudentVisits = async (req: Request, res: Response): Promise<void> => {
  const result = await visitService.listStudentVisits(
    getStudentId(req),
    req.query as unknown as ListStudentVisitsQuery
  );

  sendSuccess(res, {
    statusCode: StatusCodes.OK,
    message: 'Student visits retrieved successfully',
    data: {
      visits: result.visits
    },
    meta: {
      pagination: result.pagination
    }
  });
};
