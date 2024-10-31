import { obstacleUseCase } from 'domain/obstacle/useCase/obstacleUseCase';
import { brandedId } from 'service/brandedId';
import { defineController } from './$relay';

export default defineController(() => ({
  post: async ({ body, params }) => {
    const obstacle = await obstacleUseCase.create({
      ...body,
      questId: brandedId.quest.dto.parse(params.questId),
    });
    return {
      status: 200,
      body: obstacle,
    };
  },
}));
