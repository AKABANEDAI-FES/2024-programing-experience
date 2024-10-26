import type { StrictOmit } from '.';
import type { DtoId, MaybeId } from './brandedId';
import type { QuestDto } from './quest';

export type QuestGroupDto = {
  id: DtoId['questGroup'];
  name: string;
  description: string;
  Author: { id: DtoId['user']; signInName: string };
  Quests: QuestDto[];
};
export type QuestGroupCreateVal = StrictOmit<QuestGroupDto, 'id' | 'Quests' | 'Author'> & {
  id: MaybeId['questGroup'];
};
