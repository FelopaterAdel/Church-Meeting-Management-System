import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { attendanceApi } from '../api/attendance';
import type { AttendanceListParams } from '../types/attendance';

export const ATTENDANCE_QUERY_KEY = 'attendance';

export const useMeetingAttendance = (meetingId: string, params: AttendanceListParams) =>
  useQuery({
    queryKey: [ATTENDANCE_QUERY_KEY, 'meeting', meetingId, params],
    queryFn: () => attendanceApi.getByMeeting(meetingId, params),
    enabled: !!meetingId,
    placeholderData: keepPreviousData,
  });

export const useQrAttendance = (meetingId: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (qrCode: string) => attendanceApi.markByQr({ meetingId, qrCode }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [ATTENDANCE_QUERY_KEY, 'meeting', meetingId] });
    },
  });
};

export const useManualAttendance = (meetingId: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (studentId: string) => attendanceApi.markManual({ meetingId, studentId }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [ATTENDANCE_QUERY_KEY, 'meeting', meetingId] });
    },
  });
};
