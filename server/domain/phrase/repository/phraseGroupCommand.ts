import type { Prisma } from '@prisma/client';
import { s3 } from 'service/s3Client';
import type { PhraseGroupSaveVal } from '../model/phraseGroupType';

export const phraseGroupCommand = {
  create: async (tx: Prisma.TransactionClient, val: PhraseGroupSaveVal): Promise<void> => {
    await tx.phraseGroup.create({
      data: {
        id: val.phraseGroup.id,
        category: val.phraseGroup.category,
        backgroundImgKey: val.phraseGroup.backgroundImageKey,
        questId: val.phraseGroup.quest.id,
      },
    });
    if (val.s3Params !== undefined) await s3.put(val.s3Params);

    await tx.quest.update({
      where: { id: val.phraseGroup.quest.id },
      data: {
        phraseGroups: {
          connect: {
            id: val.phraseGroup.id,
          },
        },
      },
    });
  },
  update: async (tx: Prisma.TransactionClient, val: PhraseGroupSaveVal): Promise<void> => {
    await tx.phraseGroup.update({
      where: { id: val.phraseGroup.id },
      data: {
        category: val.phraseGroup.category,
        backgroundImgKey: val.phraseGroup.backgroundImageKey,
      },
    });
    if (val.s3Params !== undefined) await s3.put(val.s3Params);
  },
};
