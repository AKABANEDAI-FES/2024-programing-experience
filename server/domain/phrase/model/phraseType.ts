import type { StrictOmit, SubKeyObj } from 'common/types';
import type { MaybeId } from 'common/types/brandedId';
import type { PhraseDto } from 'common/types/phrase';
import type { EntityId } from 'service/brandedId';

export type PhraseEntity = StrictOmit<PhraseDto, 'id' | 'phraseGroupId'> &
  SubKeyObj<
    PhraseDto,
    {
      id: EntityId['phrase'];
      phraseGroupId: EntityId['phraseGroup'];
    }
  >;

export type PhraseCreateServerVal = StrictOmit<PhraseDto, 'id'> &
  SubKeyObj<PhraseDto, { phraseGroupId: MaybeId['phraseGroup'] }>;

export type PhraseSaveVal = { phrase: PhraseEntity };

export type PhraseDeleteVal = {
  deletable: boolean;
  phrase: PhraseEntity;
};
