import type { StrictOmit, SubKeyObj } from '.';
import type { DtoId, MaybeId } from './brandedId';

export type PhraseGroupDto = {
  id: DtoId['phraseGroup'];
  order: number;
  category: 'BEFORE_QUEST' | 'AFTER_QUEST_OK' | 'AFTER_QUEST_FAIL';
  backgroundImage: { url: string; s3Key: string } | undefined;
  Quest: { id: DtoId['quest']; name: string };
};

export type PhraseGroupCreateVal = StrictOmit<PhraseGroupDto, 'id' | 'backgroundImage' | 'Quest'> &
  SubKeyObj<PhraseGroupDto, { backgroundImage?: Blob }> & {
    questId: MaybeId['quest'];
  };

export type PhraseGroupUpdateVal = StrictOmit<PhraseGroupDto, 'id' | 'Quest' | 'backgroundImage'> &
  SubKeyObj<PhraseGroupDto, { backgroundImage?: Blob; id: MaybeId['phraseGroup'] }>;
