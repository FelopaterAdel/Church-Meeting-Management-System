export type StudentStatus = 'ACTIVE' | 'INACTIVE';

export interface Student {
  id: string;
  fullName: string;
  phoneNumber: string;
  confessionFather: string;
  address: string;
  latitude?: number;
  longitude?: number;
  stageId: string;
  qrCode: string;
  internalStudentCode: string;
  status: StudentStatus;
  createdAt: string;
  updatedAt: string;
}

export interface StudentFormData {
  fullName: string;
  phoneNumber: string;
  confessionFather: string;
  address: string;
  latitude: number | null;
  longitude: number | null;
  stageId: string;
  internalStudentCode: string;
  status: StudentStatus;
}

export interface StudentsListParams {
  page: number;
  limit: number;
  search?: string;
  stageId?: string;
  status?: StudentStatus | '';
}

export interface StudentsListResponse {
  students: Student[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}
