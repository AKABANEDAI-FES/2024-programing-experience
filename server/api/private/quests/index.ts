import type { DefineMethods } from 'aspida';
import type { QuestDto } from 'common/types/quest';
import type { QuestGroupDto } from 'common/types/questGroup';
import type { QuestCreateServerVal } from 'domain/quest/model/questType';

export type Methods = DefineMethods<{
  get: {
    query: {
      limit?: number;
    };
    resBody: QuestGroupDto[];
  };
  post: {
    reqFormat: FormData;
    reqBody: QuestCreateServerVal;
    resBody: QuestDto;
  };
}>;
