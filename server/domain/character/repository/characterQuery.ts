import type { Character, Prisma } from '@prisma/client';
import type { DtoId } from 'common/types/brandedId';
import { brandedId } from 'service/brandedId';
import type { CharacterEntity } from '../model/characterType';

export const toCharacterEntity = async (character: Character): Promise<CharacterEntity> => ({
  id: brandedId.character.entity.parse(character.id),
  name: character.name,
  description: character.description,
  imageKey: character.imageKey ?? undefined,
  questId: brandedId.quest.entity.parse(character.questId),
});

export const characterQuery = {
  findById: async (
    tx: Prisma.TransactionClient,
    id: DtoId['character'],
  ): Promise<CharacterEntity> =>
    tx.character
      .findUniqueOrThrow({
        where: { id },
      })
      .then(toCharacterEntity),
};
