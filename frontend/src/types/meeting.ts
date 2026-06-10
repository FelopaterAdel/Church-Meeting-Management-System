export type MeetingStatus = 'OPEN' | 'CLOSED';

export interface Meeting {
  id: string;
  meetingName: string;
  date: string;
  stageId: string;
  status: MeetingStatus;
  createdBy: string;
  closedBy?: string;
  closedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MeetingFormData {
  meetingName: string;
  date: string;
  stageId: string;
}

export interface MeetingsListParams {
  page: number;
  limit: number;
  search?: string;
  stageId?: string;
  status?: MeetingStatus | '';
  fromDate?: string;
  toDate?: string;
}

export interface CloseMeetingResult {
  meeting: Meeting;
  absenceSummary: {
    eligibleStudents: number;
    absenceRecordsCreated: number;
  };
}
