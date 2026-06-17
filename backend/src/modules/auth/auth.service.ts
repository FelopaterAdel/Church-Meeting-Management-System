import { StatusCodes } from 'http-status-codes';
import { UserModel, type UserDocument } from '../users/user.model.js';
import { AppError } from '../../utils/app-error.util.js';
import { hashPassword, verifyPassword } from '../../utils/password.util.js';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../../utils/token.util.js';
import { toPublicUser, type PublicUser } from '../users/user.service.js';
import type { LoginInput, RefreshTokenInput, RegisterServantInput } from './auth.validation.js';

type AuthResult = {
  user: PublicUser;
  accessToken: string;
  refreshToken: string;
};

type RefreshResult = {
  accessToken: string;
  refreshToken: string;
};

const assertCanLogin = (user: UserDocument): void => {
  if (!user.isActive) {
    throw new AppError('Account is inactive', StatusCodes.FORBIDDEN);
  }

  if (user.status !== 'APPROVED') {
    throw new AppError(`Account is ${user.status.toLowerCase()}`, StatusCodes.FORBIDDEN);
  }
};

export const registerServant = async (input: RegisterServantInput): Promise<PublicUser> => {
  const existingUser = await UserModel.exists({ email: input.email });

  if (existingUser) {
    throw new AppError('Email is already registered', StatusCodes.CONFLICT);
  }

  const passwordHash = await hashPassword(input.password);

  const user = await UserModel.create({
    fullName: input.fullName,
    email: input.email,
    passwordHash,
    role: 'SERVANT',
    status: 'PENDING'
  });

  return toPublicUser(user);
};

export const login = async (input: LoginInput): Promise<AuthResult> => {
  const user = await UserModel.findOne({ email: input.email }).select('+passwordHash');

  if (!user) {
    throw new AppError('Invalid email or password', StatusCodes.UNAUTHORIZED);
  }

  const passwordMatches = await verifyPassword(input.password, user.passwordHash);

  if (!passwordMatches) {
    throw new AppError('Invalid email or password', StatusCodes.UNAUTHORIZED);
  }

  assertCanLogin(user);

  user.lastLoginAt = new Date();
  await user.save();

  const accessToken = signAccessToken({
    sub: user.id,
    role: user.role
  });
  const refreshToken = signRefreshToken({
    sub: user.id
  });

  return {
    user: toPublicUser(user),
    accessToken,
    refreshToken
  };
};

export const refreshToken = async (input: RefreshTokenInput): Promise<RefreshResult> => {
  let payload: { sub: string };

  try {
    payload = verifyRefreshToken(input.refreshToken);
  } catch {
    throw new AppError('Refresh token is invalid or expired', StatusCodes.UNAUTHORIZED);
  }

  const user = await UserModel.findById(payload.sub);

  if (!user) {
    throw new AppError('Refresh token is invalid', StatusCodes.UNAUTHORIZED);
  }

  assertCanLogin(user);

  return {
    accessToken: signAccessToken({
      sub: user.id,
      role: user.role
    }),
    refreshToken: signRefreshToken({
      sub: user.id
    })
  };
};

export const getAuthenticatedUser = async (userId: string): Promise<PublicUser> => {
  const user = await UserModel.findById(userId);

  if (!user) {
    throw new AppError('Authenticated user was not found', StatusCodes.UNAUTHORIZED);
  }

  assertCanLogin(user);

  return toPublicUser(user);
};
