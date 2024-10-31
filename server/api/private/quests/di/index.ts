import type { DefineMethods } from 'aspida';
import type { QuestDto } from 'common/types/quest';

export type Methods = DefineMethods<{
  post: {
    reqBody: { questGroupId: string };
    resBody: QuestDto[];
  };
}>;
