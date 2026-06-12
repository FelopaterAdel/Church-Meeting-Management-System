import { StatusCodes } from 'http-status-codes';
import type { Request, Response } from 'express';
import { sendSuccess } from '../../utils/response.util.js';
import * as userService from './user.service.js';
import type { ListServantsQuery, ListUsersQuery } from './user.validation.js';

type ServantIdParams = {
  id: string;
};

type UserIdParams = {
  id: string;
};

const getUserId = (req: Request): string => {
  return (req.params as UserIdParams).id;
};

const getServantId = (req: Request): string => {
  return (req.params as ServantIdParams).id;
};

export const listUsers = async (req: Request, res: Response): Promise<void> => {
  const result = await userService.listUsers(req.query as unknown as ListUsersQuery);

  sendSuccess(res, {
    statusCode: StatusCodes.OK,
    message: 'Users retrieved successfully',
    data: {
      users: result.users
    },
    meta: {
      pagination: result.pagination
    }
  });
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

export const approveUser = async (req: Request, res: Response): Promise<void> => {
  const user = await userService.approveUser(getUserId(req));

  sendSuccess(res, {
    statusCode: StatusCodes.OK,
    message: 'User approved successfully',
    data: { user }
  });
};

export const rejectUser = async (req: Request, res: Response): Promise<void> => {
  const user = await userService.rejectUser(getUserId(req));

  sendSuccess(res, {
    statusCode: StatusCodes.OK,
    message: 'User rejected successfully',
    data: { user }
  });
};

export const suspendUser = async (req: Request, res: Response): Promise<void> => {
  const user = await userService.suspendUser(getUserId(req));

  sendSuccess(res, {
    statusCode: StatusCodes.OK,
    message: 'User suspended successfully',
    data: { user }
  });
};

export const removeUser = async (req: Request, res: Response): Promise<void> => {
  await userService.removeUser(getUserId(req), req.user!.id);

  sendSuccess(res, {
    statusCode: StatusCodes.OK,
    message: 'User removed successfully',
    data: null
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
