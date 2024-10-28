import { phraseUseCase } from 'domain/phrase/useCase/phraseUseCase';
import { defineController } from './$relay';

export default defineController(() => ({
  post: async ({ body }) => ({
    status: 201,
    body: await phraseUseCase.update(body),
  }),
  delete: async ({ body }) => ({
    status: 200,
    body: await phraseUseCase.delete(body.phraseId),
  }),
}));
