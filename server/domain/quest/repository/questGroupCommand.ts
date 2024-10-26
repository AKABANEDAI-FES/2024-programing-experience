import type { Prisma } from '@prisma/client';
import type { QuestGroupCreateVal } from '../model/questGroupType';

export const questGroupCommand = {
  create: async (tx: Prisma.TransactionClient, val: QuestGroupCreateVal): Promise<void> => {
    await tx.questGroup.create({
      data: {
        id: val.id,
        name: val.name,
        description: val.description,
        authorId: val.Author.id,
      },
    });
  },
};
