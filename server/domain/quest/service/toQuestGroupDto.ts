import type { QuestGroupDto } from 'common/types/questGroup';
import { brandedId } from 'service/brandedId';
import type { QuestGroupEntity } from '../model/questGroupType';
import { toQuestDto } from './toQuestDto';

export const toQuestGroupDto = async (questGroup: QuestGroupEntity): Promise<QuestGroupDto> => ({
  ...questGroup,
  id: brandedId.questGroup.dto.parse(questGroup.id),
  Quests: await Promise.all(questGroup.Quests.map(toQuestDto)),
});
