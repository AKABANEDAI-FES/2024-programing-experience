import type { StrictOmit } from '.';
import type { DtoId, MaybeId } from './brandedId';

export type PhraseDto = {
  id: DtoId['phrase'];
  phrase: string;
  indexInGroup: number;
  phraseGroupId: DtoId['phraseGroup'];
};

export type PhraseCreateVal = StrictOmit<PhraseDto, 'id'>;

export type PhraseUpdateVal = StrictOmit<PhraseDto, 'id' | 'phraseGroupId'>;

export type PhraseUpdateOrderVal = { phraseId: MaybeId['phrase']; order: number };

export type PhraseUpdateDto = StrictOmit<PhraseDto, 'id' | 'phraseGroupId'> & {
  phraseId: MaybeId['phrase'];
};
