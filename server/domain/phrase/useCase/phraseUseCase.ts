import type { MaybeId } from 'common/types/brandedId';
import type { PhraseCreateVal, PhraseDto, PhraseUpdateDto } from 'common/types/phrase';
import { transaction } from 'service/prismaClient';
import { phraseMethod } from '../model/phraseMethod';
import { phraseCommand } from '../repository/phraseCommand';
import { phraseQuery } from '../repository/phraseQuery';
import { toPhraseDto } from '../service/toPhraseDto';

export const phraseUseCase = {
  create: async (val: PhraseCreateVal): Promise<PhraseDto> =>
    transaction('RepeatableRead', async (tx) => {
      const created = await phraseMethod.create(val);

      await phraseCommand.create(tx, created);

      const dto = toPhraseDto(created.phrase);

      return dto;
    }),
  update: async (val: PhraseUpdateDto): Promise<PhraseDto> =>
    transaction('RepeatableRead', async (tx) => {
      const phrase = await phraseQuery.findById(tx, val.phraseId);

      const updated = await phraseMethod.update(phrase, val);

      await phraseCommand.update(tx, updated);

      const dto = toPhraseDto(updated.phrase);
      return dto;
    }),
};
