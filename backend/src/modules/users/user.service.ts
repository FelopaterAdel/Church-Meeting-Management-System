import { StatusCodes } from 'http-status-codes';
import type { FilterQuery } from 'mongoose';
import { AppError } from '../../utils/app-error.util.js';
import type { AccountStatus } from '../../types/roles.js';
import { UserModel, type User, type UserDocument } from './user.model.js';
import type { ListServantsQuery, ListUsersQuery } from './user.validation.js';

export type PublicUser = {
  id: string;
  fullName: string;
  email: string;
  role: User['role'];
  status: User['status'];
  isActive: boolean;
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
};

type PaginatedServants = {
  servants: PublicUser[];
  pagination: PaginationMeta;
};

type PaginationMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

type PaginatedUsers = {
  users: PublicUser[];
  pagination: PaginationMeta;
};

const escapeRegex = (value: string): string => {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

export const toPublicUser = (user: UserDocument): PublicUser => {
  const publicUser: PublicUser = {
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    role: user.role,
    status: user.status,
    isActive: user.isActive,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt
  };

  if (user.lastLoginAt) {
    publicUser.lastLoginAt = user.lastLoginAt;
  }

  return publicUser;
};

const buildServantFilter = (query: ListServantsQuery): FilterQuery<User> => {
  const filter: FilterQuery<User> = {
    role: 'SERVANT',
    isDeleted: { $ne: true }
  };

  if (query.status) {
    filter.status = query.status;
  }

  if (query.search) {
    const searchRegex = new RegExp(escapeRegex(query.search), 'i');
    filter.$or = [{ fullName: searchRegex }, { email: searchRegex }];
  }

  return filter;
};

const buildUserFilter = (query: ListUsersQuery): FilterQuery<User> => {
  const filter: FilterQuery<User> = {
    isDeleted: { $ne: true }
  };

  if (query.status) {
    filter.status = query.status;
  }

  if (query.role) {
    filter.role = query.role;
  }

  if (query.search) {
    const searchRegex = new RegExp(escapeRegex(query.search), 'i');
    filter.$or = [{ fullName: searchRegex }, { email: searchRegex }];
  }

  return filter;
};

const getPaginationMeta = (page: number, limit: number, total: number): PaginationMeta => {
  const totalPages = Math.ceil(total / limit);

  return {
    page,
    limit,
    total,
    totalPages,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1
  };
};

export const listUsers = async (query: ListUsersQuery): Promise<PaginatedUsers> => {
  const page = query.page;
  const limit = query.limit;
  const skip = (page - 1) * limit;
  const filter = buildUserFilter(query);

  const [users, total] = await Promise.all([
    UserModel.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    UserModel.countDocuments(filter)
  ]);

  return {
    users: users.map(toPublicUser),
    pagination: getPaginationMeta(page, limit, total)
  };
};

export const listServants = async (query: ListServantsQuery): Promise<PaginatedServants> => {
  const page = query.page;
  const limit = query.limit;
  const skip = (page - 1) * limit;
  const filter = buildServantFilter(query);

  const [servants, total] = await Promise.all([
    UserModel.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    UserModel.countDocuments(filter)
  ]);

  return {
    servants: servants.map(toPublicUser),
    pagination: getPaginationMeta(page, limit, total)
  };
};

export const getUserById = async (userId: string): Promise<PublicUser> => {
  const user = await UserModel.findOne({ _id: userId, isDeleted: { $ne: true } });

  if (!user) {
    throw new AppError('User was not found', StatusCodes.NOT_FOUND);
  }

  return toPublicUser(user);
};

export const getServantById = async (servantId: string): Promise<PublicUser> => {
  const servant = await UserModel.findOne({ _id: servantId, role: 'SERVANT', isDeleted: { $ne: true } });

  if (!servant) {
    throw new AppError('Servant was not found', StatusCodes.NOT_FOUND);
  }

  return toPublicUser(servant);
};

const updateServantStatus = async (servantId: string, status: AccountStatus): Promise<PublicUser> => {
  const servant = await UserModel.findOne({ _id: servantId, role: 'SERVANT', isDeleted: { $ne: true } });

  if (!servant) {
    throw new AppError('Servant was not found', StatusCodes.NOT_FOUND);
  }

  servant.status = status;
  servant.isActive = status !== 'SUSPENDED' && status !== 'REJECTED';
  await servant.save();

  return toPublicUser(servant);
};

const assertStatusTransition = (currentStatus: AccountStatus, nextStatus: AccountStatus): void => {
  const allowedTransitions: Record<AccountStatus, AccountStatus[]> = {
    PENDING: ['APPROVED', 'REJECTED'],
    APPROVED: ['SUSPENDED'],
    SUSPENDED: ['APPROVED'],
    REJECTED: []
  };

  if (!allowedTransitions[currentStatus].includes(nextStatus)) {
    throw new AppError(`Cannot change user status from ${currentStatus} to ${nextStatus}`, StatusCodes.BAD_REQUEST);
  }
};

const updateUserStatus = async (userId: string, status: AccountStatus): Promise<PublicUser> => {
  const user = await UserModel.findOne({ _id: userId, isDeleted: { $ne: true } });

  if (!user) {
    throw new AppError('User was not found', StatusCodes.NOT_FOUND);
  }

  assertStatusTransition(user.status, status);

  user.status = status;
  user.isActive = status !== 'SUSPENDED' && status !== 'REJECTED';
  await user.save();

  return toPublicUser(user);
};

export const approveUser = async (userId: string): Promise<PublicUser> => {
  return updateUserStatus(userId, 'APPROVED');
};

export const rejectUser = async (userId: string): Promise<PublicUser> => {
  return updateUserStatus(userId, 'REJECTED');
};

export const suspendUser = async (userId: string): Promise<PublicUser> => {
  return updateUserStatus(userId, 'SUSPENDED');
};

export const removeUser = async (userId: string, currentUserId: string): Promise<void> => {
  if (userId === currentUserId) {
    throw new AppError('You cannot remove your own account', StatusCodes.BAD_REQUEST);
  }

  const user = await UserModel.findOne({ _id: userId, isDeleted: { $ne: true } });

  if (!user) {
    throw new AppError('User was not found', StatusCodes.NOT_FOUND);
  }

  user.isActive = false;
  user.isDeleted = true;
  user.deletedAt = new Date();
  user.status = 'SUSPENDED';
  await user.save();
};

export const approveServant = async (servantId: string): Promise<PublicUser> => {
  return updateServantStatus(servantId, 'APPROVED');
};

export const rejectServant = async (servantId: string): Promise<PublicUser> => {
  return updateServantStatus(servantId, 'REJECTED');
};

export const suspendServant = async (servantId: string): Promise<PublicUser> => {
  return updateServantStatus(servantId, 'SUSPENDED');
};

export const reactivateServant = async (servantId: string): Promise<PublicUser> => {
  return updateServantStatus(servantId, 'APPROVED');
};
