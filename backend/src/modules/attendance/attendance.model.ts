import { Schema, model, type HydratedDocument, type Model, type Types } from 'mongoose';

export const ATTENDANCE_STATUSES = ['PRESENT'] as const;
export const ATTENDANCE_METHODS = ['QR', 'MANUAL'] as const;

export type AttendanceStatus = (typeof ATTENDANCE_STATUSES)[number];
export type AttendanceMethod = (typeof ATTENDANCE_METHODS)[number];

export type Attendance = {
  meeting: Types.ObjectId;
  student: Types.ObjectId;
  status: AttendanceStatus;
  method: AttendanceMethod;
  attendedAt: Date;
  recordedBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
};

export type AttendanceDocument = HydratedDocument<Attendance>;

type AttendanceModelType = Model<Attendance>;

const attendanceSchema = new Schema<Attendance, AttendanceModelType>(
  {
    meeting: {
      type: Schema.Types.ObjectId,
      ref: 'Meeting',
      required: true,
      index: true
    },
    student: {
      type: Schema.Types.ObjectId,
      ref: 'Student',
      required: true,
      index: true
    },
    status: {
      type: String,
      enum: ATTENDANCE_STATUSES,
      required: true,
      default: 'PRESENT'
    },
    method: {
      type: String,
      enum: ATTENDANCE_METHODS,
      required: true
    },
    attendedAt: {
      type: Date,
      required: true,
      default: Date.now,
      index: true
    },
    recordedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

attendanceSchema.index({ meeting: 1, student: 1 }, { unique: true });
attendanceSchema.index({ student: 1, attendedAt: -1 });
attendanceSchema.index({ meeting: 1, attendedAt: -1 });

export const AttendanceModel = model<Attendance, AttendanceModelType>('Attendance', attendanceSchema);
