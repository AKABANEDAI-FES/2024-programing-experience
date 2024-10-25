import type { DefineMethods } from 'aspida';
import type { QuestGroupDto } from 'common/types/questGroup';
import type { QuestGroupCreateVal } from 'domain/quest/model/questGroupType';

export type Methods = DefineMethods<{
  post: { reqBody: QuestGroupCreateVal; resBody: QuestGroupDto };
}>;
