import type { DefineMethods } from 'aspida';
import type { PhraseCreateVal, PhraseDto } from 'common/types/phrase';

export type Methods = DefineMethods<{
  post: {
    reqFormat: FormData;
    reqBody: PhraseCreateVal;
    resBody: PhraseDto;
  };
}>;
