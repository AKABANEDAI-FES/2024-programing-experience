import { characterUseCase } from 'domain/character/useCase/characterUseCase';
import { brandedId } from 'service/brandedId';
import { defineController } from './$relay';

export default defineController(() => ({
  post: async ({ body, params }) => ({
    status: 200,
    body: await characterUseCase.create({
      ...body,
      questId: brandedId.quest.dto.parse(params.questId),
    }),
  }),
}));
