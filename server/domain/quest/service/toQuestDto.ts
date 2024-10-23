import type { QuestDto } from 'common/types/quest';
import { brandedId } from 'service/brandedId';
import { s3 } from 'service/s3Client';
import type { QuestEntity } from '../model/questType';

export const toQuestDto = async (quest: QuestEntity): Promise<QuestDto> => ({
  ...quest,
  id: brandedId.quest.dto.parse(quest.id),
  backgroundImage: quest.imageKey
    ? { s3Key: quest.imageKey, url: await s3.getSignedUrl(quest.imageKey) }
    : undefined,
  Author: { ...quest.Author, id: brandedId.user.dto.parse(quest.Author.id) },
});
