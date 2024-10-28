import type { PhraseGroupDto } from 'common/types/phraseGroup';
import { brandedId } from 'service/brandedId';
import { s3 } from 'service/s3Client';
import type { PhraseGroupEntity } from '../model/phraseGroupType';

export const toPhraseGroupDto = (entity: PhraseGroupEntity): PhraseGroupDto => ({
  id: brandedId.phraseGroup.dto.parse(entity.id),
  category: entity.category,
  backgroundImage: entity.backgroundImageKey
    ? {
        s3Key: entity.backgroundImageKey,
        url: s3.keyToUrl(entity.backgroundImageKey),
      }
    : undefined,
  quest: { id: brandedId.quest.dto.parse(entity.quest.id), name: entity.quest.name },
});
