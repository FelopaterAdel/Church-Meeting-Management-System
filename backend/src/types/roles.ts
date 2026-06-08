export const USER_ROLES = ['SUPER_ADMIN', 'SERVANT'] as const;

export type UserRole = (typeof USER_ROLES)[number];

export const ACCOUNT_STATUSES = ['PENDING', 'APPROVED', 'SUSPENDED', 'REJECTED'] as const;

export type AccountStatus = (typeof ACCOUNT_STATUSES)[number];
