import type { QuestEntity } from 'domain/quest/model/questType';
import { brandedId } from 'service/brandedId';
import { ulid } from 'ulid';
import type {
  ObstacleCreateServerVal,
  ObstacleDeleteVal,
  ObstacleEntity,
  ObstacleSaveVal,
} from './obstacleType';

export const obstacleMethod = {
  create: (quest: QuestEntity, val: ObstacleCreateServerVal): ObstacleSaveVal => {
    const obstacle: ObstacleEntity = {
      id: brandedId.obstacle.entity.parse(ulid()),
      name: val.name,
      type: val.type,
      imageKey: undefined,
      questId: brandedId.quest.entity.parse(quest.id),
    };

    if (val.image === undefined) return { obstacle };

    const imageKey = `tasks/images/${ulid()}.${val.image.filename.split('.').at(-1)}`;

    return {
      obstacle: { ...obstacle, imageKey },
      s3Params: { key: imageKey, data: val.image },
    };
  },
  delete: (obstacle: ObstacleEntity): ObstacleDeleteVal => {
    return { obstacle, deletable: true };
  },
};
