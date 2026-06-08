import { StatusCodes } from 'http-status-codes';
import type { Request, Response } from 'express';
import { sendSuccess } from '../../utils/response.util.js';
import * as userService from './user.service.js';
import type { ListServantsQuery } from './user.validation.js';

type ServantIdParams = {
  id: string;
};

const getServantId = (req: Request): string => {
  return (req.params as ServantIdParams).id;
};

export const listServants = async (req: Request, res: Response): Promise<void> => {
  const result = await userService.listServants(req.query as unknown as ListServantsQuery);

  sendSuccess(res, {
    statusCode: StatusCodes.OK,
    message: 'Servants retrieved successfully',
    data: {
      servants: result.servants
    },
    meta: {
      pagination: result.pagination
    }
  });
};

export const getServantById = async (req: Request, res: Response): Promise<void> => {
  const servant = await userService.getServantById(getServantId(req));

  sendSuccess(res, {
    statusCode: StatusCodes.OK,
    message: 'Servant retrieved successfully',
    data: { servant }
  });
};

export const approveServant = async (req: Request, res: Response): Promise<void> => {
  const servant = await userService.approveServant(getServantId(req));

  sendSuccess(res, {
    statusCode: StatusCodes.OK,
    message: 'Servant approved successfully',
    data: { servant }
  });
};

export const rejectServant = async (req: Request, res: Response): Promise<void> => {
  const servant = await userService.rejectServant(getServantId(req));

  sendSuccess(res, {
    statusCode: StatusCodes.OK,
    message: 'Servant rejected successfully',
    data: { servant }
  });
};

export const suspendServant = async (req: Request, res: Response): Promise<void> => {
  const servant = await userService.suspendServant(getServantId(req));

  sendSuccess(res, {
    statusCode: StatusCodes.OK,
    message: 'Servant suspended successfully',
    data: { servant }
  });
};

export const reactivateServant = async (req: Request, res: Response): Promise<void> => {
  const servant = await userService.reactivateServant(getServantId(req));

  sendSuccess(res, {
    statusCode: StatusCodes.OK,
    message: 'Servant reactivated successfully',
    data: { servant }
  });
};
