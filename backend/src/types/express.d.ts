import type { UserRole } from './roles.js';
import type { AccountStatus } from './roles.js';

declare global {
  namespace Express {
    interface User {
      id: string;
      role: UserRole;
      status: AccountStatus;
    }

    interface Request {
      user?: User;
    }
  }
}

export {};
