import { Schema, model, type HydratedDocument, type Model, type Types } from 'mongoose';

export const STUDENT_STATUSES = ['ACTIVE', 'INACTIVE'] as const;

export type StudentStatus = (typeof STUDENT_STATUSES)[number];

export type Student = {
  fullName: string;
  phoneNumber: string;
  confessionFather: string;
  address: string;
  latitude?: number;
  longitude?: number;
  stage: Types.ObjectId;
  qrCode?: string;
  internalStudentCode: string;
  status: StudentStatus;
  isDeleted: boolean;
  deletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
};

export type StudentDocument = HydratedDocument<Student>;

type StudentModelType = Model<Student>;

const studentSchema = new Schema<Student, StudentModelType>(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 120,
      index: true
    },
    phoneNumber: {
      type: String,
      required: true,
      trim: true,
      maxlength: 30,
      index: true
    },
    confessionFather: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120
    },
    address: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500
    },
    latitude: {
      type: Number,
      min: -90,
      max: 90
    },
    longitude: {
      type: Number,
      min: -180,
      max: 180
    },
    stage: {
      type: Schema.Types.ObjectId,
      ref: 'Stage',
      required: true,
      index: true
    },
    qrCode: {
      type: String,
      trim: true,
      unique: true,
      sparse: true
    },
    internalStudentCode: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
      unique: true,
      index: true
    },
    status: {
      type: String,
      enum: STUDENT_STATUSES,
      required: true,
      default: 'ACTIVE',
      index: true
    },
    isDeleted: {
      type: Boolean,
      required: true,
      default: false,
      index: true
    },
    deletedAt: {
      type: Date
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

studentSchema.index({ fullName: 'text', phoneNumber: 'text', internalStudentCode: 'text' });
studentSchema.index({ stage: 1, status: 1, isDeleted: 1 });
studentSchema.index({ internalStudentCode: 1 }, { unique: true });
studentSchema.index({ qrCode: 1 }, { unique: true, sparse: true });

export const StudentModel = model<Student, StudentModelType>('Student', studentSchema);
