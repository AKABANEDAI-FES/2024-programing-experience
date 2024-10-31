import type { QuestBigDto, QuestDto } from 'common/types/quest';
import { toCharacterDto } from 'domain/character/service/toCharacterDto';
import { toObstacleDto } from 'domain/obstacle/service/toObstacleDto';
import { toPhraseGroupDtoWithoutQuest } from 'domain/phrase/service/toPhraseGroupDto';
import { brandedId } from 'service/brandedId';
import { s3 } from 'service/s3Client';
import type { QuestBigEntity, QuestEntity } from '../model/questType';

export const toQuestDto = async (quest: QuestEntity): Promise<QuestDto> => ({
  ...quest,
  id: brandedId.quest.dto.parse(quest.id),
  backgroundImage: quest.imageKey
    ? { s3Key: quest.imageKey, url: await s3.getSignedUrl(quest.imageKey) }
    : undefined,
  Author: { ...quest.Author, id: brandedId.user.dto.parse(quest.Author.id) },
});

export const toQuestDtoWithPhrases = async (quest: QuestBigEntity): Promise<QuestBigDto> => {
  const { phraseGroups, characters, obstacles, ...rest } = quest;
  return {
    ...(await toQuestDto(rest)),
    phraseGroups: phraseGroups.map(toPhraseGroupDtoWithoutQuest),
    characters: characters.map(toCharacterDto),
    obstacle: obstacles.map(toObstacleDto),
  };
};
