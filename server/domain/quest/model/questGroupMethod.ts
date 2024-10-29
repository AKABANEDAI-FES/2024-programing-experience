import type { UserDto } from 'common/types/user';
import { brandedId } from 'service/brandedId';
import { ulid } from 'ulid';
import type {
  QuestGroupCreateServerVal,
  QuestGroupEntity,
  QuestGroupSaveVal,
} from './questGroupType';

export const questGroupMethod = {
  create: (user: UserDto, val: QuestGroupCreateServerVal): QuestGroupSaveVal => {
    const questGroup: QuestGroupEntity = {
      id: brandedId.questGroup.entity.parse(ulid()),
      name: val.name,
      description: val.description,
      Author: { id: brandedId.user.entity.parse(user.id), signInName: user.signInName },
      Quests: [],
    };
    return { questGroup };
  },
};
