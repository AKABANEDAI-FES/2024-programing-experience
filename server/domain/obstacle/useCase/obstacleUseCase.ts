import type { DtoId } from 'common/types/brandedId';
import type { ObstacleDto } from 'common/types/obstacle';
import { questQuery } from 'domain/quest/repository/questQuery';
import { transaction } from 'service/prismaClient';
import { obstacleMethod } from '../model/obstacleMethod';
import type { ObstacleCreateServerVal } from '../model/obstacleType';
import { obstacleCommand } from '../repository/obstacleCommand';
import { obstacleQuery } from '../repository/obstacleQuery';
import { toObstacleDto } from '../service/toObstacleDto';

export const obstacleUseCase = {
  create: async (val: ObstacleCreateServerVal): Promise<ObstacleDto> =>
    transaction('RepeatableRead', async (tx) => {
      const quest = await questQuery.findById(tx, val.questId);

      const created = obstacleMethod.create(quest, val);

      await obstacleCommand.save(tx, created);

      return toObstacleDto(created.obstacle);
    }),
  delete: async (obstacleId: DtoId['obstacle']): Promise<ObstacleDto> =>
    transaction('RepeatableRead', async (tx) => {
      const obstacle = await obstacleQuery.findById(tx, obstacleId);

      const deleted = obstacleMethod.delete(obstacle);

      await obstacleCommand.delete(tx, deleted);

      return toObstacleDto(deleted.obstacle);
    }),
};
