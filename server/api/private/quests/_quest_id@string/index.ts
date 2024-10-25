import type { DefineMethods } from 'aspida';
import type { QuestDto } from 'common/types/quest';
import type { QuestUpdateServerVal } from 'domain/quest/model/questType';

export type Methods = DefineMethods<{
  get: {
    resBody: QuestDto;
  };

  post: {
    reqFormat: FormData;
    reqBody: QuestUpdateServerVal;
    resBody: QuestDto;
  };
  delete: {
    status: 200;
    resBody: QuestDto;
  };
}>;
