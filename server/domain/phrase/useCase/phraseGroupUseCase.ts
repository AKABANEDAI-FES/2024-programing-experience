import type { PhraseGroupDto } from 'common/types/phraseGroup';
import { questQuery } from 'domain/quest/repository/questQuery';
import { transaction } from 'service/prismaClient';
import { phraseGroupMethod } from '../model/phraseGroupMethod';
import type { PhraseGroupCreateVal, PhraseGroupUpdateVal } from '../model/phraseGroupType';
import { phraseGroupCommand } from '../repository/phraseGroupCommand';
import { phraseQuery } from '../repository/phraseQuery';
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
  update: async (val: PhraseGroupUpdateVal): Promise<PhraseGroupDto> =>
    transaction('RepeatableRead', async (tx) => {
      const phraseGroup = await phraseQuery.findByGroupId(tx, val.id);

      const updated = phraseGroupMethod.update(phraseGroup, val);

      await phraseGroupCommand.update(tx, updated);

      return toPhraseGroupDto(updated.phraseGroup);
    }),
};
