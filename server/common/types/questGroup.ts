import type { StrictOmit, SubKeyObj } from '.';
import type { DtoId, MaybeId } from './brandedId';
import type { QuestDto } from './quest';

export type QuestGroupDto = {
  id: DtoId['questGroup'];
  name: string;
  description: string;
  Author: { id: DtoId['user']; signInName: string };
  quests: QuestDto[];
};
export type QuestGroupCreateVal = StrictOmit<QuestGroupDto, 'id' | 'quests' | 'Author'> &
  SubKeyObj<
    QuestGroupDto,
    {
      id: MaybeId['questGroup'];
      Author: { id: DtoId['user']; signInName: string };
    }
  >;
