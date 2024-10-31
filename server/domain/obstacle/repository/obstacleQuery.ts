import type { Obstacle, Prisma } from '@prisma/client';
import type { DtoId } from 'common/types/brandedId';
import { brandedId } from 'service/brandedId';
import type { ObstacleEntity } from '../model/obstacleType';

export const toObstacleEntity = async (obstacle: Obstacle): Promise<ObstacleEntity> => ({
  id: brandedId.obstacle.entity.parse(obstacle.id),
  name: obstacle.name,
  type: obstacle.type,
  imageKey: obstacle.imageKey ?? undefined,
  questId: brandedId.quest.entity.parse(obstacle.questId),
});

export const obstacleQuery = {
  findById: async (tx: Prisma.TransactionClient, id: DtoId['obstacle']): Promise<ObstacleEntity> =>
    tx.obstacle
      .findFirstOrThrow({
        where: { id },
      })
      .then(toObstacleEntity),
};
