import type { DefineMethods } from 'aspida';
import type { CharacterCreateVal, CharacterDto } from 'common/types/character';

export type Methods = DefineMethods<{
  patch: {
    reqFormat: FormData;
    reqBody: CharacterCreateVal;
    resBody: CharacterDto;
  };
}>;
