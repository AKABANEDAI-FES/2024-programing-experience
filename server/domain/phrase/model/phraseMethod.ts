import { brandedId } from 'service/brandedId';
import { ulid } from 'ulid';
import type { PhraseCreateServerVal, PhraseEntity, PhraseSaveVal } from './phraseType';

export const phraseMethod = {
  create: async (val: PhraseCreateServerVal): Promise<PhraseSaveVal> => {
    const phrase: PhraseEntity = {
      id: brandedId.phrase.entity.parse(ulid()),
      phrase: val.phrase,
      indexInGroup: val.indexInGroup,
      phraseGroupId: brandedId.phraseGroup.entity.parse(val.phraseGroupId),
    };
    return { phrase };
  },
};
