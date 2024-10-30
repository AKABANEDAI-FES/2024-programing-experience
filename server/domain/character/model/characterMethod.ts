import type { QuestEntity } from 'domain/quest/model/questType';
import { brandedId } from 'service/brandedId';
import { ulid } from 'ulid';
import type { CharacterCreateServerVal, CharacterEntity, CharacterSaveVal } from './characterType';

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

    return { character };
  },
};
