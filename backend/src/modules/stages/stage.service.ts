import { StatusCodes } from 'http-status-codes';
import type { FilterQuery } from 'mongoose';
import { AppError } from '../../utils/app-error.util.js';
import { StageModel, type Stage, type StageDocument } from './stage.model.js';
import type { CreateStageInput, ListStagesQuery, UpdateStageInput } from './stage.validation.js';

export type PublicStage = {
  id: string;
  name: Stage['name'];
  description?: string;
  sortOrder: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};

const toPublicStage = (stage: StageDocument): PublicStage => {
  const publicStage: PublicStage = {
    id: stage.id,
    name: stage.name,
    sortOrder: stage.sortOrder,
    isActive: stage.isActive,
    createdAt: stage.createdAt,
    updatedAt: stage.updatedAt
  };

  if (stage.description) {
    publicStage.description = stage.description;
  }

  return publicStage;
};

const assertStageNameIsAvailable = async (name: Stage['name'], excludeStageId?: string): Promise<void> => {
  const existingStage = await StageModel.exists({
    name,
    ...(excludeStageId ? { _id: { $ne: excludeStageId } } : {})
  });

  if (existingStage) {
    throw new AppError('Stage name already exists', StatusCodes.CONFLICT);
  }
};

export const listStages = async (query: ListStagesQuery): Promise<PublicStage[]> => {
  const filter: FilterQuery<Stage> = {};

  if (query.isActive !== undefined) {
    filter.isActive = query.isActive;
  }

  const stages = await StageModel.find(filter).sort({ sortOrder: 1, createdAt: 1 });

  return stages.map(toPublicStage);
};

export const getStageById = async (stageId: string): Promise<PublicStage> => {
  const stage = await StageModel.findById(stageId);

  if (!stage) {
    throw new AppError('Stage was not found', StatusCodes.NOT_FOUND);
  }

  return toPublicStage(stage);
};

export const createStage = async (input: CreateStageInput): Promise<PublicStage> => {
  await assertStageNameIsAvailable(input.name);

  const stage = await StageModel.create(input);

  return toPublicStage(stage);
};

export const updateStage = async (stageId: string, input: UpdateStageInput): Promise<PublicStage> => {
  const stage = await StageModel.findById(stageId);

  if (!stage) {
    throw new AppError('Stage was not found', StatusCodes.NOT_FOUND);
  }

  if (input.name) {
    await assertStageNameIsAvailable(input.name, stageId);
    stage.name = input.name;
  }

  if (input.description !== undefined) {
    stage.description = input.description;
  }

  if (input.sortOrder !== undefined) {
    stage.sortOrder = input.sortOrder;
  }

  if (input.isActive !== undefined) {
    stage.isActive = input.isActive;
  }

  await stage.save();

  return toPublicStage(stage);
};

export const deleteStage = async (stageId: string): Promise<void> => {
  const stage = await StageModel.findById(stageId);

  if (!stage) {
    throw new AppError('Stage was not found', StatusCodes.NOT_FOUND);
  }

  await stage.deleteOne();
};
