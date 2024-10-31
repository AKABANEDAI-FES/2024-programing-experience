import { characterUseCase } from 'domain/character/useCase/characterUseCase';
import { brandedId } from 'service/brandedId';
import { defineController } from './$relay';

export default defineController(() => ({
  patch: async ({ body, params }) => ({
    status: 200,
    body: await characterUseCase.update({
      ...body,
      id: brandedId.character.dto.parse(params.characterId),
    }),
  }),
}));
