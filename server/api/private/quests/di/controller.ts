import { questQuery } from 'domain/quest/repository/questQuery';
import { toQuestDto } from 'domain/quest/service/toQuestDto';
import { prismaClient } from 'service/prismaClient';
import { defineController } from './$relay';

export default defineController({ listByQuestGroup: questQuery.listByQuestGroup }, (deps) => ({
  post: async ({ body }) => ({
    status: 200,

    body: await questQuery.findManyWithDI
      .inject(deps)(prismaClient, body.questGroupId)
      .then((quests) => Promise.all(quests.map(toQuestDto))),
  }),
}));
