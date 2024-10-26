import type { UserDto } from 'common/types/user';
import { brandedId } from 'service/brandedId';
import { ulid } from 'ulid';
import type {
  QuestGroupCreateServerVal,
  QuestGroupCreateVal,
  QuestGroupEntity,
} from './questGroupType';

export const questGroupMethod = {
  create: (user: UserDto, val: QuestGroupCreateServerVal): QuestGroupCreateVal => {
    const questGroup: QuestGroupEntity = {
      id: brandedId.questGroup.entity.parse(ulid()),
      name: val.name,
      description: val.description,
      Author: { id: brandedId.user.entity.parse(user.id), signInName: user.signInName },
      Quests: [],
    };
    return questGroup;
  },
};
