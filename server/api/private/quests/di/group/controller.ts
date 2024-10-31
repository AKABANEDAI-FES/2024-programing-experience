import { questQuery } from 'domain/quest/repository/questQuery';
import { toQuestGroupDto } from 'domain/quest/service/toQuestGroupDto';
import { prismaClient } from 'service/prismaClient';
import { defineController } from './$relay';

export default defineController(
  { listQuestGroupOrderByUpdatedAt: questQuery.listQuestGroupOrderByUpdatedAt },
  (deps) => ({
    get: async () => {
      const questGroup = await questQuery.findManyQuestGroupWithDI
        .inject(deps)(prismaClient, 1)
        .then((questGroups) => Promise.all(questGroups.map(toQuestGroupDto)));
      return {
        status: 200,
        body: questGroup,
      };
    },
  }),
);
