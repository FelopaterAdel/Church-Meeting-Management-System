import jwt, { type SignOptions } from 'jsonwebtoken';
import { env } from '../config/env.js';
import type { UserRole } from '../types/roles.js';

export type AccessTokenPayload = {
  sub: string;
  role: UserRole;
};

export const signAccessToken = (payload: AccessTokenPayload): string => {
  const expiresIn = env.JWT_ACCESS_EXPIRES_IN as NonNullable<SignOptions['expiresIn']>;
  const options: SignOptions = {
    expiresIn,
    issuer: 'church-meeting-management-api'
  };

  return jwt.sign(payload, env.JWT_ACCESS_SECRET, options);
};

export const verifyAccessToken = (token: string): AccessTokenPayload => {
  const decoded = jwt.verify(token, env.JWT_ACCESS_SECRET, {
    issuer: 'church-meeting-management-api'
  });

  if (typeof decoded !== 'object' || decoded === null || typeof decoded.sub !== 'string') {
    throw new Error('Invalid token payload');
  }

  return {
    sub: decoded.sub,
    role: decoded.role as UserRole
  };
};
