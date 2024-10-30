import type { QuestEntity } from 'domain/quest/model/questType';
import { brandedId } from 'service/brandedId';
import { ulid } from 'ulid';
import type {
  CharacterCreateServerVal,
  CharacterEntity,
  CharacterSaveVal,
  CharacterUpdateServerVal,
} from './characterType';

export const characterMethod = {
  create: (quest: QuestEntity, val: CharacterCreateServerVal): CharacterSaveVal => {
    const character: CharacterEntity = {
      id: brandedId.character.entity.parse(ulid()),
      name: val.name,
      description: val.description,
      imageKey: undefined,
      questId: brandedId.quest.entity.parse(quest.id),
    };

    if (val.image === undefined) return { character };

    const imageKey = `tasks/images/${ulid()}.${val.image.filename.split('.').at(-1)}`;

    return {
      character: { ...character, imageKey },
      s3Params: { key: imageKey, data: val.image },
    };
  },
  update: (character: CharacterEntity, val: CharacterUpdateServerVal): CharacterSaveVal => {
    const updated: CharacterEntity = {
      ...character,
      name: val.name,
      description: val.description,
    };

    if (val.image === undefined) return { character: updated };

    const imageKey = `tasks/images/${ulid()}.${val.image.filename.split('.').at(-1)}`;

    return {
      character: { ...updated, imageKey },
      s3Params: { key: imageKey, data: val.image },
    };
  },
};
