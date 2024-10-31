import { phraseGroupUseCase } from 'domain/phrase/useCase/phraseGroupUseCase';
import { brandedId } from 'service/brandedId';
import { defineController } from './$relay';

export default defineController(() => ({
  patch: async ({ params, body }) => ({
    status: 200,
    body: await phraseGroupUseCase.update({
      ...body,
      id: brandedId.phraseGroup.maybe.parse(params.groupId),
    }),
  }),
}));
