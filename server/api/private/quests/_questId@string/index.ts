import type { DefineMethods } from 'aspida';
import type { QuestBigDto, QuestDto, QuestUpdateVal } from 'common/types/quest';

export type Methods = DefineMethods<{
  get: {
    resBody: QuestBigDto;
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
