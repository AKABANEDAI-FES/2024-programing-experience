import type { Prisma } from '@prisma/client';
import { s3 } from 'service/s3Client';
import type { CharacterSaveVal } from '../model/characterType';

export const characterCommand = {
  save: async (tx: Prisma.TransactionClient, val: CharacterSaveVal): Promise<void> => {
    await tx.character.upsert({
      where: { id: val.character.id },
      update: {
        name: val.character.name,
        description: val.character.description,
        imageKey: val.character.imageKey,
      },
      create: {
        id: val.character.id,
        name: val.character.name,
        description: val.character.description,
        imageKey: val.character.imageKey,
        questId: val.character.questId,
      },
    });

    if (val.s3Params !== undefined) await s3.put(val.s3Params);

    await tx.quest.update({
      where: { id: val.character.questId },
      data: {
        Character: {
          connect: {
            id: val.character.id,
          },
        },
      },
    });
  },
};
