import type { Prisma } from '@prisma/client';
import type { PhraseSaveVal } from '../model/phraseType';

export const phraseCommand = {
  create: async (tx: Prisma.TransactionClient, val: PhraseSaveVal): Promise<void> => {
    await tx.phrase.create({
      data: {
        id: val.phrase.id,
        phrase: val.phrase.phrase,
        indexInGroup: val.phrase.indexInGroup,
        phraseGroupId: val.phrase.phraseGroupId,
      },
    });

    await tx.phrase.updateMany({
      where: {
        phraseGroupId: val.phrase.phraseGroupId,
        indexInGroup: {
          gt: val.phrase.indexInGroup,
        },
      },
      data: {
        indexInGroup: {
          increment: 1,
        },
      },
    });
  },
};
