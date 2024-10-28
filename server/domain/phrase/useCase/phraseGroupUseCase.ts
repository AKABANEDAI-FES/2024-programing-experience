import type { PhraseGroupDto } from 'common/types/phraseGroup';
import { questQuery } from 'domain/quest/repository/questQuery';
import { transaction } from 'service/prismaClient';
import { phraseGroupMethod } from '../model/phraseGroupMethod';
import type { PhraseGroupCreateVal } from '../model/phraseGroupType';
import { phraseGroupCommand } from '../repository/phraseGroupCommand';
import { toPhraseGroupDto } from '../service/toPhraseGroupDto';

export const phraseGroupUseCase = {
  create: async (val: PhraseGroupCreateVal): Promise<PhraseGroupDto> =>
    transaction('RepeatableRead', async (tx) => {
      const quest = await questQuery.findById(tx, val.questId);

      const created = phraseGroupMethod.create(quest, val);

      await phraseGroupCommand.create(tx, created);

      const dto = toPhraseGroupDto(created.phraseGroup);
      return dto;
    }),
};
