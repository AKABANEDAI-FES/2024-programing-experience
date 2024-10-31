import type { CharacterDto } from 'common/types/character';
import { brandedId } from 'service/brandedId';
import { s3 } from 'service/s3Client';
import type { CharacterEntity } from '../model/characterType';

export const toCharacterDto = (character: CharacterEntity): CharacterDto => ({
  id: brandedId.character.dto.parse(character.id),
  name: character.name,
  description: character.description,
  image: character.imageKey
    ? { s3Key: character.imageKey, url: s3.keyToUrl(character.imageKey) }
    : undefined,
  questId: brandedId.quest.dto.parse(character.questId),
});
