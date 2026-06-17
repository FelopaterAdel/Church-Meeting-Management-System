import { randomUUID } from 'node:crypto';
import QRCode from 'qrcode';

const STUDENT_QR_PREFIX = 'STUDENT';

export const generateStudentQrValue = (): string => {
  return `${STUDENT_QR_PREFIX}_${randomUUID()}`;
};

export const generateQrImageDataUrl = async (value: string): Promise<string> => {
  return QRCode.toDataURL(value, {
    errorCorrectionLevel: 'M',
    margin: 2,
    scale: 8,
    type: 'image/png'
  });
};
