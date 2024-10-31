import type { Prisma } from '@prisma/client';
import type { QuestGroupSaveVal } from '../model/questGroupType';

export const questGroupCommand = {
  create: async (tx: Prisma.TransactionClient, val: QuestGroupSaveVal): Promise<void> => {
    await tx.questGroup.create({
      data: {
        id: val.questGroup.id,
        name: val.questGroup.name,
        description: val.questGroup.description,
        authorId: val.questGroup.Author.id,
      },
    });
  },
};
