import type { Prisma } from '@prisma/client';
import { assert } from 'console';
import { s3 } from 'service/s3Client';
import type { QuestCreateVal, QuestDeleteVal, QuestUpdateVal } from '../model/questType';

export const questCommand = {
  create: async (tx: Prisma.TransactionClient, val: QuestCreateVal): Promise<void> => {
    await tx.quest.create({
      data: {
        id: val.quest.id,
        name: val.quest.name,
        description: val.quest.description,
        backgroundImageKey: val.quest.imageKey,
        exampleAnswer: val.quest.exampleAnswer,
        createdAt: new Date(val.quest.createdAt),
        updatedAt: null,
        indexInGroup: val.quest.indexInGroup,
        authorId: val.quest.Author.id,
        questGroupId: val.questGroupId,
      },
    });

    await tx.questGroup.update({
      where: { id: val.questGroupId },
      data: {
        Quest: {
          connect: {
            id: val.quest.id,
          },
        },
      },
    });

    await tx.quest.updateMany({
      where: {
        questGroupId: val.questGroupId,
        indexInGroup: {
          gt: val.quest.indexInGroup,
        },
      },
      data: {
        indexInGroup: {
          increment: 1,
        },
      },
    });

    if (val.s3Params !== undefined) await s3.put(val.s3Params);
  },
  update: async (tx: Prisma.TransactionClient, val: QuestUpdateVal): Promise<void> => {
    await tx.quest.update({
      where: { id: val.quest.id },
      data: {
        name: val.quest.name,
        description: val.quest.description,
        backgroundImageKey: val.quest.imageKey,
        exampleAnswer: val.quest.exampleAnswer,
        updatedAt: new Date(val.quest.updatedAt),
      },
    });
    if (val.s3Params !== undefined) await s3.put(val.s3Params);
  },
  delete: async (tx: Prisma.TransactionClient, val: QuestDeleteVal): Promise<void> => {
    assert(val.deletable);

    await tx.quest.delete({ where: { id: val.quest.id } });

    await tx.quest.updateMany({
      where: {
        questGroupId: val.questGroupId,
        indexInGroup: {
          gt: val.quest.indexInGroup,
        },
      },
      data: {
        indexInGroup: {
          decrement: 1,
        },
      },
    });

    if (val.quest.imageKey !== undefined) await s3.delete(val.quest.imageKey);
  },
};
