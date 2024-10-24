import type { DtoId } from './brandedId';
import type { QuestDto } from './quest';

export type QuestGroupDto = {
  id: DtoId['questGroup'];
  name: string;
  description: string;
  Quests: QuestDto[];
};
