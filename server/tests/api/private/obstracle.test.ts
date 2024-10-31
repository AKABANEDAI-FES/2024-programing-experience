import type { DtoId } from 'common/types/brandedId';
import type { QuestGroupCreateVal } from 'common/types/questGroup';
import { brandedId } from 'service/brandedId';
import { expect, test } from 'vitest';
import { createCognitoUserClient, noCookieClient } from '../apiClient';
import { DELETE, POST } from '../utils';

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

// Test POST /private/obstacle/quest/{questId}
test(POST(noCookieClient.private.obstacle.quest._questId('_questId')), async () => {
  const [apiClient, questId] = await setUpQuest();
  const res = await apiClient.private.obstacle.quest._questId(questId).post({
    body: {
      name: 'testName',
      type: 1,
    },
  });

  const quest = await apiClient.private.quests._questId(questId).get();

  expect(res.status).toEqual(200);
  expect(quest.body.obstacles).toHaveLength(1);
});

// Test DELETE /private/obstacle/{obstacleId}
test(DELETE(noCookieClient.private.obstacle._obstacleId('_obstacleId')), async () => {
  const [apiClient, questId] = await setUpQuest();
  const res0 = await apiClient.private.obstacle.quest._questId(questId).post({
    body: {
      name: 'testName',
      type: 1,
    },
  });
  const res = await apiClient.private.obstacle._obstacleId(res0.body.id).delete();

  expect(res.status).toEqual(200);
});
