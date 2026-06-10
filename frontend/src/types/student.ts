export type StudentStatus = 'ACTIVE' | 'INACTIVE';

export interface Student {
  id: string;
  fullName: string;
  phoneNumber: string;
  confessionFather: string;
  address: string;
  latitude: number | null;
  longitude: number | null;
  stage: string;
  qrCode: string;
  studentCode: string;
  status: StudentStatus;
}

export interface StudentFormData {
  fullName: string;
  phoneNumber: string;
  confessionFather: string;
  address: string;
  latitude: number | null;
  longitude: number | null;
  stage: string;
  status: StudentStatus;
}

export interface StudentsListParams {
  page: number;
  pageSize: number;
  search?: string;
  phoneSearch?: string;
  stage?: string;
  status?: StudentStatus | '';
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export const STAGES = [
  'KG1', 'KG2',
  'Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6',
  'Grade 7', 'Grade 8', 'Grade 9',
  'Grade 10', 'Grade 11', 'Grade 12',
  'University Year 1', 'University Year 2', 'University Year 3', 'University Year 4',
  'Graduate',
] as const;
