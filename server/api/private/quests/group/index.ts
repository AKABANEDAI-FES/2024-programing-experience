import type { DefineMethods } from 'aspida';
import type { QuestGroupCreateVal, QuestGroupDto } from 'common/types/questGroup';

export type Methods = DefineMethods<{
  post: { reqBody: QuestGroupCreateVal; resBody: QuestGroupDto };
}>;
