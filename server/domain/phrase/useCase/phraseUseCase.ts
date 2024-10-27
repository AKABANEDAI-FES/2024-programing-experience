import type { PhraseCreateVal, PhraseDto } from 'common/types/phrase';
import { transaction } from 'service/prismaClient';
import { phraseMethod } from '../model/phraseMethod';
import { phraseCommand } from '../repository/phraseCommand';
import { toPhraseDto } from '../service/toPhraseDto';

export const phraseUseCase = {
  create: async (val: PhraseCreateVal): Promise<PhraseDto> =>
    transaction('RepeatableRead', async (tx) => {
      const created = await phraseMethod.create(val);

      await phraseCommand.create(tx, created);

      const dto = toPhraseDto(created.phrase);

      return dto;
    }),
};
