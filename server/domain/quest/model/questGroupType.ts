import type { StrictOmit } from 'common/types';
import type { QuestGroupDto } from 'common/types/questGroup';
import type { EntityId } from 'service/brandedId';
export type QuestGroupEntity = StrictOmit<QuestGroupDto, 'id'> & {
  id: EntityId['questGroup'];
};
