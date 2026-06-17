import { z } from 'zod';

const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(128, 'Password must be at most 128 characters')
  .regex(/[A-Z]/, 'Password must include at least one uppercase letter')
  .regex(/[a-z]/, 'Password must include at least one lowercase letter')
  .regex(/[0-9]/, 'Password must include at least one number');

export const registerServantSchema = z.object({
  body: z.object({
    fullName: z.string().trim().min(2).max(120),
    email: z.string().trim().email().toLowerCase(),
    password: passwordSchema
  })
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().trim().email().toLowerCase(),
    password: z.string().min(1, 'Password is required')
  })
});

export const refreshTokenSchema = z.object({
  body: z.object({
    refreshToken: z.string().trim().min(1, 'Refresh token is required')
  })
});

export type RegisterServantInput = z.infer<typeof registerServantSchema>['body'];
export type LoginInput = z.infer<typeof loginSchema>['body'];
export type RefreshTokenInput = z.infer<typeof refreshTokenSchema>['body'];
