import type { DefineMethods } from 'aspida';
import type { QuestDto, QuestUpdateVal } from 'common/types/quest';

export type Methods = DefineMethods<{
  get: {
    resBody: QuestDto;
  };

  post: {
    reqFormat: FormData;
    reqBody: QuestUpdateVal;
    resBody: QuestDto;
  };
  delete: {
    status: 200;
    resBody: QuestDto;
  };
}>;
