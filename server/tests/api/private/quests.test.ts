import type { QuestCreateVal } from 'common/types/quest';
import type { QuestGroupCreateVal } from 'common/types/questGroup';
import { brandedId } from 'service/brandedId';
import { expect, test } from 'vitest';
import { createCognitoUserClient, noCookieClient } from '../apiClient';
import { DELETE, GET, POST } from '../utils';

const sampleScripts = [
  {
    script: [
      { id: 0, arg: [] },
      { id: 1, arg: ['10'] },
    ],
    position: { x: 0, y: 0 },
  },
];

// クエストの一覧を取得
test(GET(noCookieClient.private.quests), async () => {
  const apiClient = await createCognitoUserClient();
  const res = await apiClient.private.quests.get({ query: { limit: 10 } });

  expect(res.status).toEqual(200);
  expect(res.body).toBeInstanceOf(Array);
});

// クエストグループを作成
test(POST(noCookieClient.private.quests.group), async () => {
  const apiClient = await createCognitoUserClient();
  const newQuestGroup: QuestGroupCreateVal = {
    id: brandedId.questGroup.maybe.parse('dummy'),
    name: 'Sample Quest Group',
    description: 'This is a sample quest group',
  };
  const res = await apiClient.private.quests.group.post({ body: newQuestGroup });

  expect(res.status).toEqual(201);
  expect(res.body).toHaveProperty('id');
  expect(res.body.name).toBe(newQuestGroup.name);
  expect(res.body.description).toBe(newQuestGroup.description);
});

// 自分が作成したクエストグループの一覧を取得
test(GET(noCookieClient.private.quests.group.my), async () => {
  const apiClient = await createCognitoUserClient();
  const res = await apiClient.private.quests.group.my.get();

  expect(res.status).toEqual(200);
  expect(res.body).toBeInstanceOf(Array);
});

// 新しいクエストを作成
test(POST(noCookieClient.private.quests), async () => {
  const apiClient = await createCognitoUserClient();
  const newQuestGroup: QuestGroupCreateVal = {
    id: brandedId.questGroup.maybe.parse('dummy'),
    name: 'Sample Quest Group',
    description: 'This is a sample quest group',
  };
  const res0 = await apiClient.private.quests.group.post({ body: newQuestGroup });
  const newQuest: QuestCreateVal = {
    name: 'Sample Quest',
    description: 'This is a sample quest',
    backgroundImage: undefined,
    exampleAnswer: JSON.stringify(sampleScripts),
    indexInGroup: 0,
    questGroupId: brandedId.questGroup.maybe.parse(res0.body.id),
  };
  const res = await apiClient.private.quests.post({ body: newQuest });

  expect(res.status).toEqual(201);
  expect(res.body).toHaveProperty('id');
  expect(res.body.name).toBe(newQuest.name);
  expect(res.body.description).toBe(newQuest.description);
});

// クエストの詳細を取得
test(GET(noCookieClient.private.quests._questId('_questId')), async () => {
  const apiClient = await createCognitoUserClient();
  const newQuestGroup: QuestGroupCreateVal = {
    id: brandedId.questGroup.maybe.parse('dummy'),
    name: 'Sample Quest Group',
    description: 'This is a sample quest group',
  };
  const res0 = await apiClient.private.quests.group.post({ body: newQuestGroup });
  const createdQuest = await apiClient.private.quests.post({
    body: {
      name: 'Detail Quest',
      description: 'For detail test',
      backgroundImage: undefined,
      exampleAnswer: JSON.stringify(sampleScripts),
      indexInGroup: 0,
      questGroupId: brandedId.questGroup.maybe.parse(res0.body.id),
    },
  });
  const res = await apiClient.private.quests._questId(createdQuest.body.id).get();

  expect(res.status).toEqual(200);
  expect(res.body).toHaveProperty('id', createdQuest.body.id);
  expect(res.body.name).toBe('Detail Quest');
});

// クエストグループのクエスト一覧を取得
test(GET(noCookieClient.private.quests.group._groupId('_groupId')), async () => {
  const apiClient = await createCognitoUserClient();
  const newQuestGroup: QuestGroupCreateVal = {
    id: brandedId.questGroup.maybe.parse('dummy'),
    name: 'Sample Quest Group',
    description: 'This is a sample quest group',
  };
  const res0 = await apiClient.private.quests.group.post({ body: newQuestGroup });
  const createdQuest = await apiClient.private.quests.post({
    body: {
      name: 'Quest in Group',
      description: 'For group test',
      backgroundImage: undefined,
      exampleAnswer: JSON.stringify(sampleScripts),
      indexInGroup: 0,
      questGroupId: brandedId.questGroup.maybe.parse(res0.body.id),
    },
  });
  const res = await apiClient.private.quests.group._groupId(res0.body.id).get();

  expect(res.status).toEqual(200);
  expect(res.body).toBeInstanceOf(Array);
  expect(res.body[0].id).toBe(createdQuest.body.id);
  expect(res.body[0].name).toBe('Quest in Group');
});

// クエストを更新
test(POST(noCookieClient.private.quests._questId('_questId')), async () => {
  const apiClient = await createCognitoUserClient();
  const newQuestGroup: QuestGroupCreateVal = {
    id: brandedId.questGroup.maybe.parse('dummy'),
    name: 'Sample Quest Group',
    description: 'This is a sample quest group',
  };
  const res0 = await apiClient.private.quests.group.post({ body: newQuestGroup });
  const createdQuest = await apiClient.private.quests.post({
    body: {
      name: 'Old Quest',
      description: 'To be updated',
      backgroundImage: undefined,
      exampleAnswer: JSON.stringify(sampleScripts),
      indexInGroup: 0,
      questGroupId: brandedId.questGroup.maybe.parse(res0.body.id),
    },
  });
  const updatedData = {
    id: createdQuest.body.id,
    name: 'Updated Quest',
    description: 'Updated description',
    backgroundImage: undefined,
    exampleAnswer: JSON.stringify(sampleScripts),
    indexInGroup: 0,
    questGroupId: brandedId.questGroup.maybe.parse('dummy'),
  };
  const res = await apiClient.private.quests
    ._questId(createdQuest.body.id)
    .post({ body: updatedData });

  expect(res.status).toEqual(200);
  expect(res.body.name).toBe(updatedData.name);
  expect(res.body.description).toBe(updatedData.description);
});

// クエストを削除
test(DELETE(noCookieClient.private.quests._questId('_questId')), async () => {
  const apiClient = await createCognitoUserClient();
  const newQuestGroup: QuestGroupCreateVal = {
    id: brandedId.questGroup.maybe.parse('dummy'),
    name: 'Sample Quest Group',
    description: 'This is a sample quest group',
  };
  const res0 = await apiClient.private.quests.group.post({ body: newQuestGroup });
  const createdQuest = await apiClient.private.quests.post({
    body: {
      name: 'Old Quest',
      description: 'To be updated',
      backgroundImage: undefined,
      exampleAnswer: JSON.stringify(sampleScripts),
      indexInGroup: 0,
      questGroupId: brandedId.questGroup.maybe.parse(res0.body.id),
    },
  });
  const res = await apiClient.private.quests._questId(createdQuest.body.id).delete();

  expect(res.status).toEqual(200);
});
