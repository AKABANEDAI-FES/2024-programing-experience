import type { PhraseUpdateDto } from 'common/types/phrase';
import { brandedId } from 'service/brandedId';
import { ulid } from 'ulid';
import type {
  PhraseCreateServerVal,
  PhraseDeleteVal,
  PhraseEntity,
  PhraseSaveVal,
} from './phraseType';

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
  update: async (phrase: PhraseEntity, dto: PhraseUpdateDto): Promise<PhraseSaveVal> => {
    return { phrase: { ...phrase, ...dto } };
  },
  delete: (phrase: PhraseEntity): PhraseDeleteVal => {
    return {
      deletable: true,
      phrase,
    };
  },
};
