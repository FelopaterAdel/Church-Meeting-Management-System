import { StatusCodes } from 'http-status-codes';
import type { Request, Response } from 'express';
import { sendSuccess } from '../../utils/response.util.js';
import * as stageService from './stage.service.js';
import type { CreateStageInput, ListStagesQuery, UpdateStageInput } from './stage.validation.js';

type StageIdParams = {
  id: string;
};

const getStageId = (req: Request): string => {
  return (req.params as StageIdParams).id;
};

export const listStages = async (req: Request, res: Response): Promise<void> => {
  const stages = await stageService.listStages(req.query as unknown as ListStagesQuery);

  sendSuccess(res, {
    statusCode: StatusCodes.OK,
    message: 'Stages retrieved successfully',
    data: { stages }
  });
};

export const getStageById = async (req: Request, res: Response): Promise<void> => {
  const stage = await stageService.getStageById(getStageId(req));

  sendSuccess(res, {
    statusCode: StatusCodes.OK,
    message: 'Stage retrieved successfully',
    data: { stage }
  });
};

export const createStage = async (req: Request, res: Response): Promise<void> => {
  const stage = await stageService.createStage(req.body as CreateStageInput);

  sendSuccess(res, {
    statusCode: StatusCodes.CREATED,
    message: 'Stage created successfully',
    data: { stage }
  });
};

export const updateStage = async (req: Request, res: Response): Promise<void> => {
  const stage = await stageService.updateStage(getStageId(req), req.body as UpdateStageInput);

  sendSuccess(res, {
    statusCode: StatusCodes.OK,
    message: 'Stage updated successfully',
    data: { stage }
  });
};

export const deleteStage = async (req: Request, res: Response): Promise<void> => {
  await stageService.deleteStage(getStageId(req));

  sendSuccess(res, {
    statusCode: StatusCodes.OK,
    message: 'Stage deleted successfully'
  });
};
