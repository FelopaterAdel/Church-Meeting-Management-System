import apiClient from './client';
import type {
  Student,
  StudentFormData,
  StudentsListParams,
  PaginatedResponse,
} from '../types/student';

export const studentsApi = {
  getAll: async (params: StudentsListParams): Promise<PaginatedResponse<Student>> => {
    const { data } = await apiClient.get<PaginatedResponse<Student>>('/students', { params });
    return data;
  },

  getById: async (id: string): Promise<Student> => {
    const { data } = await apiClient.get<Student>(`/students/${id}`);
    return data;
  },

  create: async (payload: StudentFormData): Promise<Student> => {
    const { data } = await apiClient.post<Student>('/students', payload);
    return data;
  },

  update: async (id: string, payload: Partial<StudentFormData>): Promise<Student> => {
    const { data } = await apiClient.put<Student>(`/students/${id}`, payload);
    return data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/students/${id}`);
  },
};
