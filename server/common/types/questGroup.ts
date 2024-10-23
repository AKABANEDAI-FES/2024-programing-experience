import type { EntityId } from 'service/brandedId';

export type QuestGroupDto = {
  id: EntityId['questGroup'];
  name: string;
  description: string;
};
