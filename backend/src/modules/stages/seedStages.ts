import { StageModel, STAGE_NAMES } from './stage.model.js';

export async function seedStages(): Promise<void> {
  const stages = STAGE_NAMES.map((name, index) => ({
    name,
    sortOrder: index + 1,
    isActive: true,
  }));

  await Promise.all(
    stages.map((stage) =>
      StageModel.updateOne(
        { name: stage.name },
        { $setOnInsert: stage },
        { upsert: true }
      )
    )
  );

  console.log('Stages seeded');
}