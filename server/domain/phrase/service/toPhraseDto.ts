import type { PhraseDto } from 'common/types/phrase';
import { brandedId } from 'service/brandedId';
import type { PhraseEntity } from '../model/phraseType';

export const toPhraseDto = (entity: PhraseEntity): PhraseDto => ({
  id: brandedId.phrase.dto.parse(entity.id),
  phrase: entity.phrase,
  indexInGroup: entity.indexInGroup,
  phraseGroupId: brandedId.phraseGroup.dto.parse(entity.phraseGroupId),
});
