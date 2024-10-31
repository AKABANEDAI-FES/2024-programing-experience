import { obstacleUseCase } from 'domain/obstacle/useCase/obstacleUseCase';
import { brandedId } from 'service/brandedId';
import { defineController } from './$relay';

export default defineController(() => ({
  delete: async ({ params }) => {
    const obstacle = await obstacleUseCase.delete(brandedId.obstacle.dto.parse(params.obstacleId));
    return {
      status: 200,
      body: obstacle,
    };
  },
}));
