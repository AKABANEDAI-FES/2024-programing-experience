import type { CharacterDto } from 'common/types/character';
import { questQuery } from 'domain/quest/repository/questQuery';
import { transaction } from 'service/prismaClient';
import { characterMethod } from '../model/characterMethod';
import type {
  CharacterCreateServerVal,
  CharacterSaveVal,
  CharacterUpdateServerVal,
} from '../model/characterType';
import { characterCommand } from '../repository/characterCommand';
import { characterQuery } from '../repository/characterQuery';
import { toCharacterDto } from '../service/toCharacterDto';

export const characterUseCase = {
  create: async (val: CharacterCreateServerVal): Promise<CharacterDto> =>
    transaction('RepeatableRead', async (tx) => {
      const quest = await questQuery.findById(tx, val.questId);

      const created: CharacterSaveVal = characterMethod.create(quest, val);

      await characterCommand.save(tx, created);

      return toCharacterDto(created.character);
    }),
  update: async (val: CharacterUpdateServerVal): Promise<CharacterDto> =>
    transaction('RepeatableRead', async (tx) => {
      const character = await characterQuery.findById(tx, val.id);

      const updated = characterMethod.update(character, val);

      await characterCommand.save(tx, updated);

      return toCharacterDto(updated.character);
    }),
};
