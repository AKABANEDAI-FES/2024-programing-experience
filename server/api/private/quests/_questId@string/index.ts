import type { DefineMethods } from 'aspida';
import type { QuestDto, QuestDtoWithPhrases, QuestUpdateVal } from 'common/types/quest';

export type Methods = DefineMethods<{
  get: {
    resBody: QuestDtoWithPhrases;
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
