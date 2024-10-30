import type { DtoId } from 'common/types/brandedId';
import type { QuestGroupCreateVal } from 'common/types/questGroup';
import { brandedId } from 'service/brandedId';
import { expect, test } from 'vitest';
import { createCognitoUserClient, noCookieClient } from '../apiClient';
import { DELETE, PATCH, POST } from '../utils';

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

// セリフの作成
test(POST(noCookieClient.private.phrases._phraseId('_phraseId')), async () => {
  const [apiClient, questId] = await setUpQuest();

  const newPhraseGroup = {
    category: 'BEFORE_QUEST' as const,
    questId: brandedId.quest.dto.parse(questId),
  };
  const res0 = await apiClient.private.phrases.group.post({
    body: newPhraseGroup,
  });
  const res = await apiClient.private.phrases.post({
    body: { phrase: 'test phrase', indexInGroup: 0, phraseGroupId: res0.body.id },
  });

  expect(res.status).toEqual(201);
  expect(res.body).toHaveProperty('id');
  expect(res.body).toHaveProperty('phrase', 'test phrase');
});

// セリフの更新
test(POST(noCookieClient.private.phrases._phraseId('_phraseId')), async () => {
  const [apiClient, questId] = await setUpQuest();

  const newPhraseGroup = {
    category: 'BEFORE_QUEST' as const,
    questId: brandedId.quest.dto.parse(questId),
  };
  const res0 = await apiClient.private.phrases.group.post({
    body: newPhraseGroup,
  });
  const res01 = await apiClient.private.phrases.post({
    body: { phrase: 'test phrase', indexInGroup: 0, phraseGroupId: res0.body.id },
  });

  const res = await apiClient.private.phrases._phraseId(res01.body.id).post({
    body: { phrase: 'fixed test phrase', indexInGroup: 0 },
  });

  expect(res.status).toEqual(201);
  expect(res.body).toHaveProperty('id');
  expect(res.body).toHaveProperty('phrase', 'fixed test phrase');
  expect(res.body).toHaveProperty('indexInGroup', 0);
});

// セリフの削除
test(DELETE(noCookieClient.private.phrases._phraseId('_phraseId')), async () => {
  const [apiClient, questId] = await setUpQuest();

  const newPhraseGroup = {
    category: 'BEFORE_QUEST' as const,
    questId: brandedId.quest.dto.parse(questId),
  };
  const res0 = await apiClient.private.phrases.group.post({
    body: newPhraseGroup,
  });
  const res01 = await apiClient.private.phrases.post({
    body: { phrase: 'test phrase', indexInGroup: 0, phraseGroupId: res0.body.id },
  });

  const res = await apiClient.private.phrases._phraseId(res01.body.id).delete();

  expect(res.status).toEqual(200);
  expect(res.body).toHaveProperty('id');
});

test(POST(noCookieClient.private.phrases.group), async () => {
  const [apiClient, questId] = await setUpQuest();

  const res = await apiClient.private.phrases.group.post({
    body: {
      questId: brandedId.quest.dto.parse(questId),
      category: 'BEFORE_QUEST',
    },
  });
  const res1 = await apiClient.private.quests._questId(questId).get();
  expect(res.status).toEqual(201);
  expect(res.body).toHaveProperty('id');
  expect(res.body).toHaveProperty('category', 'BEFORE_QUEST');
  expect(res1.body.phraseGroups).toHaveLength(1);
});

// Test PATCH /private/phrases/group/{groupId}
test(PATCH(noCookieClient.private.phrases.group._groupId('_groupId')), async () => {
  const [apiClient, questId] = await setUpQuest();

  const res0 = await apiClient.private.phrases.group.post({
    body: {
      questId: brandedId.quest.dto.parse(questId),
      category: 'BEFORE_QUEST',
    },
  });

  const res = await apiClient.private.phrases.group._groupId(res0.body.id).patch({
    body: {
      category: 'AFTER_QUEST_FAIL',
    },
  });

  expect(res.status).toEqual(200);
  expect(res.body).toHaveProperty('id');
  expect(res.body).toHaveProperty('category', 'AFTER_QUEST_FAIL');
});

// Test POST /private/phrases/group

// Test POST /private/phrases
test(POST(noCookieClient.private.phrases), async () => {
  const [apiClient, questId] = await setUpQuest();

  const res0 = await apiClient.private.phrases.group.post({
    body: {
      questId: brandedId.quest.dto.parse(questId),
      category: 'BEFORE_QUEST',
    },
  });
  const res = await apiClient.private.phrases.post({
    body: {
      phrase: 'test phrase',
      indexInGroup: 0,
      phraseGroupId: brandedId.phraseGroup.dto.parse(res0.body.id),
    },
  });

  expect(res.status).toEqual(201);
  expect(res.body).toHaveProperty('id');
  expect(res.body).toHaveProperty('phrase', 'test phrase');
  expect(res.body).toHaveProperty('indexInGroup', 0);
});
