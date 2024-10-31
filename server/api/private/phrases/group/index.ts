import type { DefineMethods } from 'aspida';
import type { PhraseGroupCreateDto, PhraseGroupDto } from 'common/types/phraseGroup';

export type Methods = DefineMethods<{
  post: {
    reqFormat: FormData;
    reqBody: PhraseGroupCreateDto;
    resBody: PhraseGroupDto;
  };
}>;
