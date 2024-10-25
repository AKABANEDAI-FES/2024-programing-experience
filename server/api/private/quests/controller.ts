import { questQuery } from 'domain/quest/repository/questQuery';
import { toQuestGroupDto } from 'domain/quest/service/toQuestGroupDto';
import { questUseCase } from 'domain/quest/useCase/questUseCase';
import { prismaClient } from 'service/prismaClient';
import { defineController } from './$relay';

export default defineController(() => ({
  get: async ({ query }) => ({
    status: 200,
    body: await questQuery
      .listQuestGroupByUpdatedAt(prismaClient, query.limit)
      .then((group) => Promise.all(group.map(toQuestGroupDto))),
  }),
  post: async ({ user, body }) => ({
    status: 201,
    body: await questUseCase.create(user, body),
  }),
}));
