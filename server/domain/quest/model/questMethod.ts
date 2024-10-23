import assert from 'assert';
import type { UserDto } from 'common/types/user';
import { brandedId } from 'service/brandedId';
import { ulid } from 'ulid';
import type {
  QuestCreateEntityVal,
  QuestCreateServerVal,
  QuestDeleteVal,
  QuestEntity,
  QuestUpdateEntityVal,
  QuestUpdateServerVal,
} from '../model/questType';
export const questMethod = {
  create: (
    user: UserDto,
    { quest: questVal }: QuestCreateServerVal,
    val: QuestEntity[],
  ): QuestCreateEntityVal => {
    const quest: QuestEntity = {
      id: brandedId.quest.entity.parse(ulid()),
      name: questVal.name,
      description: questVal.description,
      imageKey: undefined,
      exampleAnswer: questVal.exampleAnswer,
      createdAt: Date.now(),
      updatedAt: undefined,
      indexInGroup: questVal.indexInGroup - 0.1,
      author: { id: brandedId.user.entity.parse(user.id), signInName: user.signInName },
    };

    const updatedQuests = [...val, { ...quest }]
      .sort((a, b) => a.indexInGroup - b.indexInGroup)
      .map((q, indexInGroup) => ({ ...q, indexInGroup }))
      .slice(questVal.indexInGroup);

    if (questVal.backgroundImage === undefined) return { quests: updatedQuests };

    const imageKey = `quests/images/${ulid()}.${questVal.backgroundImage.filename.split('.').at(-1)}`;
    return {
      quests: updatedQuests,
      s3Params: { key: imageKey, data: questVal.backgroundImage },
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
