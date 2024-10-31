import type { DefineMethods } from 'aspida';
import type { QuestGroupDto } from 'common/types/questGroup';

export type Methods = DefineMethods<{
  get: {
    resBody: QuestGroupDto[];
  };
}>;
