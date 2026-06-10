export type AttendanceStatus = 'PRESENT' | 'ABSENT';
export type AttendanceMethod = 'QR' | 'MANUAL' | 'SYSTEM';

export interface Attendance {
  id: string;
  meetingId: string;
  studentId: string;
  status: AttendanceStatus;
  method: AttendanceMethod;
  attendedAt: string;
  recordedBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface AttendanceListParams {
  page: number;
  limit: number;
}
