import { Types, type FilterQuery, type PipelineStage } from 'mongoose';
import { AttendanceModel, type Attendance } from '../attendance/attendance.model.js';
import { MeetingModel, type Meeting } from '../meetings/meeting.model.js';
import { StageModel } from '../stages/stage.model.js';
import { StudentModel } from '../students/student.model.js';
import type {
  DashboardStatisticsQuery,
  StageAttendanceReportQuery,
  StudentRankingReportQuery
} from './statistics.validation.js';

type CountByStatusResult = {
  _id: Attendance['status'];
  count: number;
};

type StudentRankingResult = {
  _id: Types.ObjectId;
  count: number;
  student?: {
    fullName: string;
    stage: Types.ObjectId;
  };
  stage?: Array<{
    name: string;
  }>;
};

type StageReportResult = {
  _id: Types.ObjectId;
  presentCount: number;
  absentCount: number;
  totalRecords: number;
  stage?: Array<{
    name: string;
  }>;
};

type AttendanceMatch = FilterQuery<Attendance>;
type MeetingMatch = FilterQuery<Meeting>;

const roundPercentage = (value: number): number => {
  return Math.round(value * 100) / 100;
};

const buildAttendanceMatch = (
  query: DashboardStatisticsQuery | StudentRankingReportQuery | StageAttendanceReportQuery
): AttendanceMatch => {
  const match: AttendanceMatch = {};

  if (query.fromDate || query.toDate) {
    match.attendedAt = {};

    if (query.fromDate) {
      match.attendedAt.$gte = query.fromDate;
    }

    if (query.toDate) {
      match.attendedAt.$lte = query.toDate;
    }
  }

  return match;
};

const buildMeetingMatch = (query: DashboardStatisticsQuery): MeetingMatch => {
  const match: MeetingMatch = {};

  if (query.stageId) {
    match.stage = new Types.ObjectId(query.stageId);
  }

  if (query.fromDate || query.toDate) {
    match.date = {};

    if (query.fromDate) {
      match.date.$gte = query.fromDate;
    }

    if (query.toDate) {
      match.date.$lte = query.toDate;
    }
  }

  return match;
};

const countAttendanceByStatus = async (query: DashboardStatisticsQuery): Promise<{
  presentCount: number;
  absentCount: number;
}> => {
  const baseMatch = buildAttendanceMatch(query);
  const pipeline: PipelineStage[] = [{ $match: baseMatch }];

  if (query.stageId) {
    pipeline.push(
      {
        $lookup: {
          from: 'students',
          localField: 'student',
          foreignField: '_id',
          as: 'student'
        }
      },
      { $unwind: '$student' },
      {
        $match: {
          'student.stage': new Types.ObjectId(query.stageId),
          'student.isDeleted': false
        }
      }
    );
  }

  pipeline.push({
    $group: {
      _id: '$status',
      count: { $sum: 1 }
    }
  });

  const results = await AttendanceModel.aggregate<CountByStatusResult>(pipeline);

  return results.reduce(
    (accumulator, item) => {
      if (item._id === 'PRESENT') {
        accumulator.presentCount = item.count;
      }

      if (item._id === 'ABSENT') {
        accumulator.absentCount = item.count;
      }

      return accumulator;
    },
    {
      presentCount: 0,
      absentCount: 0
    }
  );
};

export const getDashboardStatistics = async (
  query: DashboardStatisticsQuery
): Promise<{
  totalStudents: number;
  totalActiveStudents: number;
  attendancePercentage: number;
  totalMeetings: number;
  presentCount: number;
  absentCount: number;
}> => {
  const studentMatch = {
    isDeleted: false,
    ...(query.stageId ? { stage: new Types.ObjectId(query.stageId) } : {})
  };
  const activeStudentMatch = {
    ...studentMatch,
    status: 'ACTIVE'
  };

  const [totalStudents, totalActiveStudents, totalMeetings, attendanceCounts] = await Promise.all([
    StudentModel.countDocuments(studentMatch),
    StudentModel.countDocuments(activeStudentMatch),
    MeetingModel.countDocuments(buildMeetingMatch(query)),
    countAttendanceByStatus(query)
  ]);

  const totalAttendanceRecords = attendanceCounts.presentCount + attendanceCounts.absentCount;
  const attendancePercentage =
    totalAttendanceRecords === 0 ? 0 : roundPercentage((attendanceCounts.presentCount / totalAttendanceRecords) * 100);

  return {
    totalStudents,
    totalActiveStudents,
    attendancePercentage,
    totalMeetings,
    presentCount: attendanceCounts.presentCount,
    absentCount: attendanceCounts.absentCount
  };
};

const getStudentRankingReport = async (
  query: StudentRankingReportQuery,
  status: Attendance['status']
): Promise<
  Array<{
    studentId: string;
    fullName: string;
    stageId: string;
    stageName: string | null;
    count: number;
  }>
> => {
  const match = {
    ...buildAttendanceMatch(query),
    status
  };

  const pipeline: PipelineStage[] = [
    { $match: match },
    {
      $lookup: {
        from: 'students',
        localField: 'student',
        foreignField: '_id',
        as: 'student'
      }
    },
    { $unwind: '$student' },
    {
      $match: {
        'student.isDeleted': false,
        ...(query.stageId ? { 'student.stage': new Types.ObjectId(query.stageId) } : {})
      }
    },
    {
      $group: {
        _id: '$student._id',
        count: { $sum: 1 },
        student: { $first: '$student' }
      }
    },
    {
      $lookup: {
        from: 'stages',
        localField: 'student.stage',
        foreignField: '_id',
        as: 'stage'
      }
    },
    { $sort: { count: -1, 'student.fullName': 1 } },
    { $limit: query.limit }
  ];

  const results = await AttendanceModel.aggregate<StudentRankingResult>(pipeline);

  return results.map((item) => {
    const student = item.student;
    const stage = item.stage?.[0];

    return {
      studentId: item._id.toString(),
      fullName: student?.fullName ?? 'Unknown Student',
      stageId: student?.stage?.toString() ?? '',
      stageName: stage?.name ?? null,
      count: item.count
    };
  });
};

export const getMostActiveStudents = async (query: StudentRankingReportQuery): Promise<
  Array<{
    studentId: string;
    fullName: string;
    stageId: string;
    stageName: string | null;
    count: number;
  }>
> => {
  return getStudentRankingReport(query, 'PRESENT');
};

export const getMostAbsentStudents = async (query: StudentRankingReportQuery): Promise<
  Array<{
    studentId: string;
    fullName: string;
    stageId: string;
    stageName: string | null;
    count: number;
  }>
> => {
  return getStudentRankingReport(query, 'ABSENT');
};

export const getStageAttendanceReport = async (
  query: StageAttendanceReportQuery
): Promise<
  Array<{
    stageId: string;
    stageName: string;
    presentCount: number;
    absentCount: number;
    totalRecords: number;
    attendancePercentage: number;
  }>
> => {
  const pipeline: PipelineStage[] = [
    { $match: buildAttendanceMatch(query) },
    {
      $lookup: {
        from: 'students',
        localField: 'student',
        foreignField: '_id',
        as: 'student'
      }
    },
    { $unwind: '$student' },
    {
      $match: {
        'student.isDeleted': false
      }
    },
    {
      $group: {
        _id: '$student.stage',
        presentCount: {
          $sum: {
            $cond: [{ $eq: ['$status', 'PRESENT'] }, 1, 0]
          }
        },
        absentCount: {
          $sum: {
            $cond: [{ $eq: ['$status', 'ABSENT'] }, 1, 0]
          }
        },
        totalRecords: { $sum: 1 }
      }
    },
    {
      $lookup: {
        from: 'stages',
        localField: '_id',
        foreignField: '_id',
        as: 'stage'
      }
    },
    { $sort: { 'stage.sortOrder': 1 } }
  ];

  const results = await AttendanceModel.aggregate<StageReportResult>(pipeline);
  const stages = await StageModel.find({}).sort({ sortOrder: 1 });
  const reportByStageId = new Map(results.map((item) => [item._id.toString(), item]));

  return stages.map((stage) => {
    const report = reportByStageId.get(stage.id);
    const presentCount = report?.presentCount ?? 0;
    const absentCount = report?.absentCount ?? 0;
    const totalRecords = report?.totalRecords ?? 0;
    const attendancePercentage = totalRecords === 0 ? 0 : roundPercentage((presentCount / totalRecords) * 100);

    return {
      stageId: stage.id,
      stageName: stage.name,
      presentCount,
      absentCount,
      totalRecords,
      attendancePercentage
    };
  });
};
