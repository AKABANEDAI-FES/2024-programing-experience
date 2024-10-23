import assert from 'assert';
import type { UserDto } from 'common/types/user';
import { brandedId } from 'service/brandedId';
import { ulid } from 'ulid';
import type {
  QuestCreateServerVal,
  QuestCreateVal,
  QuestDeleteVal,
  QuestEntity,
  QuestUpdateEntityVal,
  QuestUpdateServerVal,
} from '../model/questType';
export const questMethod = {
  create: (user: UserDto, val: QuestCreateServerVal): QuestCreateVal => {
    const quest: QuestEntity = {
      id: brandedId.quest.entity.parse(ulid()),
      name: val.name,
      description: val.description,
      imageKey: undefined,
      exampleAnswer: val.exampleAnswer,
      createdAt: Date.now(),
      updatedAt: undefined,
      indexInGroup: val.indexInGroup,
      author: { id: brandedId.user.entity.parse(user.id), signInName: user.signInName },
    };

    if (val.backgroundImage === undefined) return { quest };

    const imageKey = `quests/images/${ulid()}.${val.backgroundImage.filename.split('.').at(-1)}`;

    return {
      quest: { ...quest, imageKey },
      s3Params: { key: imageKey, data: val.backgroundImage },
    };
  },
  update: (user: UserDto, quest: QuestEntity, val: QuestUpdateServerVal): QuestUpdateEntityVal => {
    assert(user.id === String(quest.author.id));

    if (val.backgroundImage === undefined)
      return { quest: { ...quest, ...val, updatedAt: Date.now() } };

    const imageKey = `quests/images/${ulid()}.${val.backgroundImage.filename.split('.').at(-1)}`;
    return {
      quest: { ...quest, ...val, imageKey, updatedAt: Date.now() },
      s3Params: { key: imageKey, data: val.backgroundImage },
    };
  },
  delete: (user: UserDto, quest: QuestEntity): QuestDeleteVal => {
    assert(user.id === String(quest.author.id));

    return { deletable: true, quest };
  },
};
