import { questGroupUseCase } from 'domain/quest/useCase/questGroupUseCase';
import { defineController } from './$relay';

export default defineController(() => ({
  post: async ({ user, body }) => ({
    status: 201,
    body: await questGroupUseCase.create(user, body),
  }),
}));
