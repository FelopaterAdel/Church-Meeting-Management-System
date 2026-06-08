import { Schema, model, type HydratedDocument, type Model, type Types } from 'mongoose';

export type Visit = {
  student: Types.ObjectId;
  servant: Types.ObjectId;
  visitDate: Date;
  notes: string;
  isDeleted: boolean;
  deletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
};

export type VisitDocument = HydratedDocument<Visit>;

type VisitModelType = Model<Visit>;

const visitSchema = new Schema<Visit, VisitModelType>(
  {
    student: {
      type: Schema.Types.ObjectId,
      ref: 'Student',
      required: true,
      index: true
    },
    servant: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    visitDate: {
      type: Date,
      required: true,
      index: true
    },
    notes: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000
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

visitSchema.index({ student: 1, visitDate: -1, isDeleted: 1 });
visitSchema.index({ servant: 1, visitDate: -1, isDeleted: 1 });

export const VisitModel = model<Visit, VisitModelType>('Visit', visitSchema);
