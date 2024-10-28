import type { DefineMethods } from 'aspida';
import type { DtoId } from 'common/types/brandedId';
import type { PhraseDto, PhraseUpdateDto } from 'common/types/phrase';

export type Methods = DefineMethods<{
  post: {
    reqFormat: FormData;
    reqBody: PhraseUpdateDto;
    resBody: PhraseDto;
  };
  delete: {
    reqBody: {
      phraseId: DtoId['phrase'];
    };
    resBody: PhraseDto;
  };
}>;
