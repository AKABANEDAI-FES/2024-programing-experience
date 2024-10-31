import type { Prisma } from '@prisma/client';
import { s3 } from 'service/s3Client';
import type { ObstacleSaveVal } from '../model/obstacleType';

export const obstacleCommand = {
  save: async (tx: Prisma.TransactionClient, val: ObstacleSaveVal): Promise<void> => {
    await tx.obstacle.upsert({
      where: { id: val.obstacle.id },
      update: {
        name: val.obstacle.name,
        type: val.obstacle.type,
        imageKey: val.obstacle.imageKey,
      },
      create: {
        id: val.obstacle.id,
        name: val.obstacle.name,
        type: val.obstacle.type,
        imageKey: val.obstacle.imageKey,
        questId: val.obstacle.questId,
      },
    });

    if (val.s3Params !== undefined) await s3.put(val.s3Params);

    await tx.quest.update({
      where: { id: val.obstacle.questId },
      data: {
        obstacles: {
          connect: {
            id: val.obstacle.id,
          },
        },
      },
    });
  },
  delete: async (tx: Prisma.TransactionClient, val: ObstacleSaveVal): Promise<void> => {
    await tx.obstacle.delete({
      where: { id: val.obstacle.id },
    });
  },
};
