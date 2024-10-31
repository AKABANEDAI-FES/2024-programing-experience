import type { ObstacleDto } from 'common/types/obstacle';
import { brandedId } from 'service/brandedId';
import { s3 } from 'service/s3Client';
import type { ObstacleEntity } from '../model/obstacleType';

export const toObstacleDto = (obstacle: ObstacleEntity): ObstacleDto => ({
  id: brandedId.obstacle.dto.parse(obstacle.id),
  name: obstacle.name,
  type: obstacle.type,
  image: obstacle.imageKey
    ? { s3Key: obstacle.imageKey, url: s3.keyToUrl(obstacle.imageKey) }
    : undefined,
  questId: brandedId.quest.dto.parse(obstacle.questId),
});
