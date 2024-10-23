import type { EntityId } from 'service/brandedId';
import type { QuestDto } from './quest';

export type QuestGroupDto = {
  id: EntityId['questGroup'];
  name: string;
  description: string;
  Quests: QuestDto[];
};
