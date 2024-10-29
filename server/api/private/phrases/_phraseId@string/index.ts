import type { DefineMethods } from 'aspida';
import type { PhraseDto, PhraseUpdateVal } from 'common/types/phrase';

export type Methods = DefineMethods<{
  post: {
    reqFormat: FormData;
    reqBody: PhraseUpdateVal;
    resBody: PhraseDto;
  };
  delete: {
    resBody: PhraseDto;
  };
}>;
