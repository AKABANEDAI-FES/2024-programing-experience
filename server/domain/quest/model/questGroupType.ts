import type { StrictOmit, SubKeyObj } from 'common/types';
import type { QuestGroupDto } from 'common/types/questGroup';
import type { EntityId } from 'service/brandedId';
import type { QuestEntity } from './questType';

export type QuestGroupEntity = StrictOmit<QuestGroupDto, 'id' | 'quests' | 'Author'> &
  SubKeyObj<
    QuestGroupDto,
    {
      id: EntityId['questGroup'];
      quests: QuestEntity[];
      Author: StrictOmit<QuestGroupDto['Author'], 'id'> &
        SubKeyObj<QuestGroupDto['Author'], { id: EntityId['user'] }>;
    }
  >;

export type QuestGroupCreateServerVal = StrictOmit<QuestGroupDto, 'id' | 'quests' | 'Author'>;
export type QuestGroupSaveVal = { questGroup: QuestGroupEntity };
