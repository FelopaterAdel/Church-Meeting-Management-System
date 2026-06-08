import { Schema, model, type HydratedDocument, type Model, type Types } from 'mongoose';

export const MEETING_STATUSES = ['OPEN', 'CLOSED'] as const;

export type MeetingStatus = (typeof MEETING_STATUSES)[number];

export type Meeting = {
  meetingName: string;
  date: Date;
  stage: Types.ObjectId;
  status: MeetingStatus;
  createdBy: Types.ObjectId;
  closedBy?: Types.ObjectId;
  closedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
};

export type MeetingDocument = HydratedDocument<Meeting>;

type MeetingModelType = Model<Meeting>;

const meetingSchema = new Schema<Meeting, MeetingModelType>(
  {
    meetingName: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 160,
      index: true
    },
    date: {
      type: Date,
      required: true,
      index: true
    },
    stage: {
      type: Schema.Types.ObjectId,
      ref: 'Stage',
      required: true,
      index: true
    },
    status: {
      type: String,
      enum: MEETING_STATUSES,
      required: true,
      default: 'OPEN',
      index: true
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    closedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    closedAt: {
      type: Date
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

meetingSchema.index({ stage: 1, date: -1 });
meetingSchema.index({ status: 1, date: -1 });
meetingSchema.index({ meetingName: 'text' });

export const MeetingModel = model<Meeting, MeetingModelType>('Meeting', meetingSchema);
