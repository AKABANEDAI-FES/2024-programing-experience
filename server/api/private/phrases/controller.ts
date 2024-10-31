import { phraseUseCase } from 'domain/phrase/useCase/phraseUseCase';
import { defineController } from './$relay';

export default defineController(() => ({
  post: async ({ body }) => ({
    status: 201,
    body: await phraseUseCase.create(body),
  }),
}));
