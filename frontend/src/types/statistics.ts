export interface DashboardStatistics {
  totalStudents: number;
  totalActiveStudents: number;
  attendancePercentage: number;
  totalMeetings: number;
  presentCount: number;
  absentCount: number;
}

export interface StudentRankingItem {
  studentId: string;
  fullName: string;
  stageId: string;
  stageName: string | null;
  count: number;
}

export interface StatisticsFilters {
  fromDate?: string;
  toDate?: string;
  stageId?: string;
  limit?: number;
}
