import { Schema, model, type HydratedDocument, type Model } from 'mongoose';

export const STAGE_NAMES = ['First Stage', 'Second Stage', 'Third Stage'] as const;

export type StageName = (typeof STAGE_NAMES)[number];

export type Stage = {
  name: StageName;
  description?: string;
  sortOrder: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type StageDocument = HydratedDocument<Stage>;

type StageModelType = Model<Stage>;

const stageSchema = new Schema<Stage, StageModelType>(
  {
    name: {
      type: String,
      enum: STAGE_NAMES,
      required: true,
      unique: true,
      trim: true
    },
    description: {
      type: String,
      trim: true,
      maxlength: 500
    },
    sortOrder: {
      type: Number,
      required: true,
      min: 1,
      default: 1,
      index: true
    },
    isActive: {
      type: Boolean,
      required: true,
      default: true,
      index: true
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

stageSchema.index({ name: 1 }, { unique: true });
stageSchema.index({ isActive: 1, sortOrder: 1 });

export const StageModel = model<Stage, StageModelType>('Stage', stageSchema);
