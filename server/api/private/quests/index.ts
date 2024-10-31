import type { DefineMethods } from 'aspida';
import type { QuestCreateVal, QuestDto } from 'common/types/quest';
import type { QuestGroupDto } from 'common/types/questGroup';

export type Methods = DefineMethods<{
  get: {
    query: {
      limit?: number;
    };
    resBody: QuestGroupDto[];
  };
  post: {
    reqFormat: FormData;
    reqBody: QuestCreateVal;
    resBody: QuestDto;
  };
}>;
