import type { QuestGroupDto } from 'common/types/questGroup';
import type { UserDto } from 'common/types/user';
import { transaction } from 'service/prismaClient';
import { questGroupMethod } from '../model/questGroupMethod';
import type { QuestGroupCreateServerVal } from '../model/questGroupType';
import { questGroupCommand } from '../repository/questGroupCommand';
import { toQuestGroupDto } from '../service/toQuestGroupDto';

export const questGroupUseCase = {
  create: async (user: UserDto, val: QuestGroupCreateServerVal): Promise<QuestGroupDto> =>
    transaction('RepeatableRead', async (tx) => {
      const created = questGroupMethod.create(user, val);

      await questGroupCommand.create(tx, created);

      const dto = toQuestGroupDto(created);

      return dto;
    }),
};
