import assert from 'assert';
import { categoryValidator } from 'common/validators/phraseGroup';
import type { QuestEntity } from 'domain/quest/model/questType';
import { brandedId } from 'service/brandedId';
import { ulid } from 'ulid';
import type {
  PhraseGroupCreateServerVal,
  PhraseGroupEntity,
  PhraseGroupSaveVal,
} from './phraseGroupType';

export const phraseGroupMethod = {
  create: (quest: QuestEntity, val: PhraseGroupCreateServerVal): PhraseGroupSaveVal => {
    const phraseGroup: PhraseGroupSaveVal['phraseGroup'] = {
      id: brandedId.phraseGroup.entity.parse(ulid()),
      category: categoryValidator.parse(val.category),
      backgroundImageKey: undefined,
      Phrases: [],
      quest: { ...quest, id: brandedId.quest.entity.parse(quest.id) },
    };
    assert(phraseGroup.quest !== null);

    if (val.backgroundImage === undefined) return { phraseGroup };

    const backgroundImageKey = `phraseGroups/backgroundImages/${ulid()}.${val.backgroundImage.filename.split('.').at(-1)}`;

    return {
      phraseGroup: { ...phraseGroup },
      s3Params: { key: backgroundImageKey, data: val.backgroundImage },
    };
  },
  update: (phraseGroup: PhraseGroupEntity, val: PhraseGroupCreateServerVal): PhraseGroupSaveVal => {
    assert(phraseGroup.quest !== null);
    const quest = phraseGroup.quest;
    if (val.backgroundImage === undefined)
      return {
        phraseGroup: { ...phraseGroup, ...val, id: phraseGroup.id, quest },
      };

    const backgroundImageKey = `phraseGroups/backgroundImages/${ulid()}.${val.backgroundImage.filename.split('.').at(-1)}`;

    return {
      phraseGroup: { ...phraseGroup, quest },
      s3Params: { key: backgroundImageKey, data: val.backgroundImage },
    };
  },
};
