import apiClient from './client';
import type {
  Student,
  StudentFormData,
  StudentQRCodeResponse,
  StudentsListParams,
  StudentsListResponse,
} from '../types/student';
import type { ApiEnvelope, ApiPaginationMeta } from '../types/api';

type StudentPayload = Omit<StudentFormData, 'latitude' | 'longitude'> & {
  latitude?: number;
  longitude?: number;
};

const toStudentPayload = (payload: Partial<StudentFormData>): Partial<StudentPayload> => ({
  ...payload,
  latitude: payload.latitude ?? undefined,
  longitude: payload.longitude ?? undefined,
});

export const studentsApi = {
  getAll: async (params: StudentsListParams): Promise<StudentsListResponse> => {
    const { data } = await apiClient.get<ApiEnvelope<{ students: Student[] }, ApiPaginationMeta>>('/students', {
      params,
    });
    return {
      students: data.data.students,
      pagination: data.meta!.pagination,
    };
  },

  getById: async (id: string): Promise<Student> => {
    const { data } = await apiClient.get<ApiEnvelope<{ student: Student }>>(`/students/${id}`);
    return data.data.student;
  },

  getQRCode: async (id: string): Promise<StudentQRCodeResponse> => {
    const { data } = await apiClient.get<ApiEnvelope<StudentQRCodeResponse>>(`/students/${id}/qrcode`);
    return data.data;
  },

  create: async (payload: StudentFormData): Promise<Student> => {
    const { data } = await apiClient.post<ApiEnvelope<{ student: Student }>>('/students', toStudentPayload(payload));
    return data.data.student;
  },

  update: async (id: string, payload: Partial<StudentFormData>): Promise<Student> => {
    const { data } = await apiClient.put<ApiEnvelope<{ student: Student }>>(
      `/students/${id}`,
      toStudentPayload(payload)
    );
    return data.data.student;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/students/${id}`);
  },
};
