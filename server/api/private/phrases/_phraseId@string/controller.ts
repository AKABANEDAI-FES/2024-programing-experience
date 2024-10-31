import { phraseUseCase } from 'domain/phrase/useCase/phraseUseCase';
import { brandedId } from 'service/brandedId';
import { defineController } from './$relay';

export default defineController(() => ({
  post: async ({ body, params }) => ({
    status: 201,
    body: await phraseUseCase.update({
      ...body,
      phraseId: brandedId.phrase.maybe.parse(params.phraseId),
    }),
  }),
  delete: async ({ params }) => {
    const phrase = await phraseUseCase.delete(brandedId.phrase.maybe.parse(params.phraseId));
    return {
      status: 200,
      body: phrase,
    };
  },
}));
