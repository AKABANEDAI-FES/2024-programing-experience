import { phraseGroupUseCase } from 'domain/phrase/useCase/phraseGroupUseCase';
import { defineController } from './$relay';

export default defineController(() => ({
  post: async ({ body }) => ({
    status: 201,
    body: await phraseGroupUseCase.create(body),
  }),
}));
