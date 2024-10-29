import type { StrictOmit, SubKeyObj } from 'common/types';
import type { QuestGroupDto } from 'common/types/questGroup';
import type { EntityId } from 'service/brandedId';
import type { QuestEntity } from './questType';

export type QuestGroupEntity = StrictOmit<QuestGroupDto, 'id' | 'Quests' | 'Author'> &
  SubKeyObj<
    QuestGroupDto,
    {
      id: EntityId['questGroup'];
      Quests: QuestEntity[];
      Author: StrictOmit<QuestGroupDto['Author'], 'id'> &
        SubKeyObj<QuestGroupDto['Author'], { id: EntityId['user'] }>;
    }
  >;

export type QuestGroupCreateServerVal = StrictOmit<QuestGroupDto, 'id' | 'Quests' | 'Author'>;
export type QuestGroupSaveVal = { questGroup: QuestGroupEntity };
