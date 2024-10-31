import type { DtoId } from 'common/types/brandedId';
import type { QuestGroupCreateVal } from 'common/types/questGroup';
import { brandedId } from 'service/brandedId';
import { expect, test } from 'vitest';
import { createCognitoUserClient, noCookieClient } from '../apiClient';
import { PATCH, POST } from '../utils';

const setUpQuest = async (): Promise<[typeof noCookieClient, DtoId['quest']]> => {
  const apiClient = await createCognitoUserClient();

  const newQuestGroup: QuestGroupCreateVal = {
    id: brandedId.questGroup.maybe.parse('dummy'),
    name: 'Sample Quest Group',
    description: 'This is a sample quest group',
    Author: { id: brandedId.user.dto.parse('dummy'), signInName: 'dummy' },
  };
  const res00 = await apiClient.private.quests.group.post({ body: newQuestGroup });
  const newQuest = {
    name: 'Sample Quest',
    description: 'This is a sample quest',
    backgroundImage: undefined,
    exampleAnswer: JSON.stringify([]),
    indexInGroup: 0,
    questGroupId: brandedId.questGroup.maybe.parse(res00.body.id),
  };
  const res01 = await apiClient.private.quests.post({ body: newQuest });

  return [apiClient, res01.body.id];
};
// Test POST /private/character/{questId}
test(POST(noCookieClient.private.character._questId('_questId')), async () => {
  const [apiClient, questId] = await setUpQuest();

  const res = await apiClient.private.character._questId(questId).post({
    body: {
      name: 'testName',
      description: 'testDescription',
    },
  });
  const res1 = await apiClient.private.quests._questId(questId).get();
  expect(res.status).toEqual(200);
  expect(res.body).toHaveProperty('id');
  expect(res1.body.characters).toBeInstanceOf(Array);
  expect(res1.body.characters).toHaveLength(1);
});

// Test PATCH /private/character/character/{characterId}
test(PATCH(noCookieClient.private.character.character._characterId('_characterId')), async () => {
  const [apiClient, questId] = await setUpQuest();

  const res0 = await apiClient.private.character._questId(questId).post({
    body: {
      name: 'testName',
      description: 'testDescription',
    },
  });

  const res = await apiClient.private.character.character._characterId(res0.body.id).patch({
    body: {
      name: 'updatedName',
      description: 'updatedDescription',
    },
  });

  expect(res.status).toEqual(200);
  expect(res.body).toHaveProperty('id');
});
