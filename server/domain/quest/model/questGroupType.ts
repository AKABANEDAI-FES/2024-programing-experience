import type { StrictOmit } from 'common/types';
import type { QuestGroupDto } from 'common/types/questGroup';
import type { EntityId } from 'service/brandedId';
import type { QuestEntity } from './questType';

export type QuestGroupEntity = StrictOmit<QuestGroupDto, 'id' | 'Quests' | 'Author'> & {
  id: EntityId['questGroup'];
  Quests: QuestEntity[];
  Author: StrictOmit<QuestGroupDto['Author'], 'id'> & { id: EntityId['user'] };
};

export type QuestGroupCreateServerVal = StrictOmit<QuestGroupDto, 'id' | 'Quests' | 'Author'>;
