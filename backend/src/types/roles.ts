export const USER_ROLES = ['SUPER_ADMIN', 'SERVANT'] as const;

export type UserRole = (typeof USER_ROLES)[number];
