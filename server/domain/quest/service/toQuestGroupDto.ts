import type { QuestGroupDto } from 'common/types/questGroup';
import { brandedId } from 'service/brandedId';
import type { QuestGroupEntity } from '../model/questGroupType';
import { toQuestDto } from './toQuestDto';

export const toQuestGroupDto = async (questGroup: QuestGroupEntity): Promise<QuestGroupDto> => ({
  ...questGroup,
  id: brandedId.questGroup.dto.parse(questGroup.id),
  quests: await Promise.all(questGroup.quests.map(toQuestDto)),
  Author: { ...questGroup.Author, id: brandedId.user.dto.parse(questGroup.Author.id) },
});
