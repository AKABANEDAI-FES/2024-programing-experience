import { questQuery } from 'domain/quest/repository/questQuery';
import { toQuestGroupDto } from 'domain/quest/service/toQuestGroupDto';
import { prismaClient } from 'service/prismaClient';
import { defineController } from './$relay';

export default defineController(() => ({
  get: async ({ user }) => {
    const group = await questQuery
      .listQuestGroupByAuthorId(prismaClient, user.id)
      .then((q) => Promise.all(q.map(toQuestGroupDto)));

    return {
      status: 200,
      body: group,
    };
  },
}));
