import { questQuery } from 'domain/quest/repository/questQuery';
import { toQuestDto } from 'domain/quest/service/toQuestDto';
import { questUseCase } from 'domain/quest/useCase/questUseCase';
import { brandedId } from 'service/brandedId';
import { prismaClient } from 'service/prismaClient';
import { defineController } from './$relay';

export default defineController(() => ({
  get: async ({ params }) => {
    const quest = await questQuery.findById(prismaClient, params.quest_id);

    return {
      status: 200,
      body: await toQuestDto(quest),
    };
  },
  post: async ({ user, params, body }) => ({
    status: 200,
    body: await questUseCase.update(user, {
      ...body,
      questId: brandedId.quest.maybe.parse(params.quest_id),
    }),
  }),
  delete: async ({ user, params }) => ({
    status: 200,
    body: await questUseCase.delete(user, brandedId.quest.maybe.parse(params.quest_id)),
  }),
}));
