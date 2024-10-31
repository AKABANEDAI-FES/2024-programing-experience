import type { DefineMethods } from 'aspida';
import type { CharacterDto, CharacterUpdateVal } from 'common/types/character';

export type Methods = DefineMethods<{
  post: {
    reqFormat: FormData;
    reqBody: CharacterUpdateVal;
    resBody: CharacterDto;
  };
}>;
