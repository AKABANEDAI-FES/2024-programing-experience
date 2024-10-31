import { questQuery } from 'domain/quest/repository/questQuery';
import { toQuestDto } from 'domain/quest/service/toQuestDto';
import { prismaClient } from 'service/prismaClient';
import { defineController } from './$relay';

export default defineController(() => ({
  get: async ({ params }) => {
    const group = await questQuery
      .listByQuestGroup(prismaClient, params.groupId)
      .then((q) => Promise.all(q.map(toQuestDto)));

    return {
      status: 200,
      body: group,
    };
  },
}));
