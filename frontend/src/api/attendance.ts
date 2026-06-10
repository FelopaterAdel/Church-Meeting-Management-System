import apiClient from './client';
import type { Attendance, AttendanceListParams } from '../types/attendance';
import type { ApiEnvelope, ApiPaginationMeta } from '../types/api';

export const attendanceApi = {
  markByQr: async (payload: { meetingId: string; qrCode: string }): Promise<Attendance> => {
    const { data } = await apiClient.post<ApiEnvelope<{ attendance: Attendance }>>('/attendance/qr', payload);
    return data.data.attendance;
  },

  markManual: async (payload: { meetingId: string; studentId: string }): Promise<Attendance> => {
    const { data } = await apiClient.post<ApiEnvelope<{ attendance: Attendance }>>('/attendance/manual', payload);
    return data.data.attendance;
  },

  getByMeeting: async (
    meetingId: string,
    params: AttendanceListParams
  ): Promise<{ attendance: Attendance[]; pagination: ApiPaginationMeta['pagination'] }> => {
    const { data } = await apiClient.get<ApiEnvelope<{ attendance: Attendance[] }, ApiPaginationMeta>>(
      `/attendance/meetings/${meetingId}`,
      { params }
    );
    return {
      attendance: data.data.attendance,
      pagination: data.meta!.pagination,
    };
  },

  getByStudent: async (
    studentId: string,
    params: AttendanceListParams
  ): Promise<{ attendance: Attendance[]; pagination: ApiPaginationMeta['pagination'] }> => {
    const { data } = await apiClient.get<ApiEnvelope<{ attendance: Attendance[] }, ApiPaginationMeta>>(
      `/attendance/students/${studentId}`,
      { params }
    );
    return {
      attendance: data.data.attendance,
      pagination: data.meta!.pagination,
    };
  },
};
