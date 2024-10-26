import type { StrictOmit, SubKeyObj } from '.';
import type { DtoId, MaybeId } from './brandedId';

export type PhraseDto = {
  id: DtoId['phrase'];
  phrase: string;
  indexInGroup: number;
  phraseGroupId: DtoId['phraseGroup'];
};

export type PhraseCreateVal = StrictOmit<PhraseDto, 'id'>;

export type PhraseUpdateOrderVal = { phraseId: MaybeId['phrase']; order: number };

export type PhraseUpdateVal = StrictOmit<PhraseDto, 'id' | 'phraseGroupId'> &
  SubKeyObj<
    PhraseDto,
    {
      id: MaybeId['phrase'];
    }
  >;
