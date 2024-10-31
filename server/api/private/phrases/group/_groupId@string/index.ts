import type { DefineMethods } from 'aspida';
import type { PhraseGroupDto, PhraseGroupUpdateDto } from 'common/types/phraseGroup';

export type Methods = DefineMethods<{
  patch: {
    reqFormat: FormData;
    reqBody: PhraseGroupUpdateDto;
    resBody: PhraseGroupDto;
  };
}>;
