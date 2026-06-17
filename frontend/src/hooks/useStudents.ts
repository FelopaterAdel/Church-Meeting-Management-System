import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from '@tanstack/react-query';
import { studentsApi } from '../api/students';
import type { StudentFormData, StudentsListParams } from '../types/student';

export const STUDENTS_QUERY_KEY = 'students';

export const useStudents = (params: StudentsListParams) =>
  useQuery({
    queryKey: [STUDENTS_QUERY_KEY, params],
    queryFn: () => studentsApi.getAll(params),
    placeholderData: keepPreviousData,
  });

export const useStudent = (id: string) =>
  useQuery({
    queryKey: [STUDENTS_QUERY_KEY, id],
    queryFn: () => studentsApi.getById(id),
    enabled: !!id,
  });

export const useStudentQRCode = (id: string) =>
  useQuery({
    queryKey: [STUDENTS_QUERY_KEY, id, 'qrcode'],
    queryFn: () => studentsApi.getQRCode(id),
    enabled: !!id,
  });

export const useCreateStudent = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: StudentFormData) => studentsApi.create(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: [STUDENTS_QUERY_KEY] }),
  });
};

export const useUpdateStudent = (id: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<StudentFormData>) => studentsApi.update(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [STUDENTS_QUERY_KEY] });
      qc.invalidateQueries({ queryKey: [STUDENTS_QUERY_KEY, id] });
    },
  });
};

export const useDeleteStudent = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => studentsApi.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: [STUDENTS_QUERY_KEY] }),
  });
};
