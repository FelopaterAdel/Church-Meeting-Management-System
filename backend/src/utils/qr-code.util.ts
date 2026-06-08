import { randomUUID } from 'node:crypto';

const STUDENT_QR_PREFIX = 'CMMS-STUDENT';

export const generateStudentQrValue = (): string => {
  return `${STUDENT_QR_PREFIX}-${randomUUID()}`;
};
