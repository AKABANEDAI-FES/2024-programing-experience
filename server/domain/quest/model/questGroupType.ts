import type { StrictOmit } from 'common/types';
import type { QuestGroupDto } from 'common/types/questGroup';
import type { EntityId } from 'service/brandedId';
import type { QuestEntity } from './questType';

export type QuestGroupEntity = StrictOmit<QuestGroupDto, 'id' | 'Quests'> & {
  id: EntityId['questGroup'];
  Quests: QuestEntity[];
};
