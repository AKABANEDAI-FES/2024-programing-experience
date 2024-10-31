import type { Prisma } from '@prisma/client';
import questController from 'api/private/quests/di/controller';
import questGroupController from 'api/private/quests/di/group/controller';
import taskController from 'api/private/tasks/di/controller';
import type { DtoId } from 'common/types/brandedId';
import type { UserDto } from 'common/types/user';
import type { QuestGroupEntity } from 'domain/quest/model/questGroupType';
import type { QuestEntity } from 'domain/quest/model/questType';
import type { TaskEntity } from 'domain/task/model/taskType';
import fastify from 'fastify';
import { brandedId } from 'service/brandedId';
import { ulid } from 'ulid';
import { expect, test } from 'vitest';

test('Dependency Injection', async () => {
  const user: UserDto = {
    id: brandedId.user.dto.parse(ulid()),
    signInName: 'dummy-user',
    displayName: 'dummy-name',
    email: 'aa@example.com',
    isAdmin: false,
    language: 'KANJI',
    photoUrl: 'https://example.com/user.png',
    createdTime: Date.now(),
  };
  const res1 = await taskController(fastify()).get({ user });

  expect(res1.body).toHaveLength(0);

  const mockedFindManyTask = async (
    _: Prisma.TransactionClient,
    authorId: DtoId['user'],
  ): Promise<TaskEntity[]> => [
    {
      id: brandedId.task.entity.parse(ulid()),
      label: 'baz',
      done: false,
      imageKey: undefined,
      createdTime: Date.now(),
      author: { id: brandedId.user.entity.parse(authorId), signInName: user.signInName },
    },
  ];

  const res2 = await taskController
    .inject({ listByAuthorId: mockedFindManyTask })(fastify())
    .get({ user });

  expect(res2.body).toHaveLength(1);

  const mockedFindManyQuest = async (
    _: Prisma.TransactionClient,
    __: string,
  ): Promise<QuestEntity[]> => [
    {
      id: brandedId.quest.entity.parse(ulid()),
      name: 'foo',
      description: 'bar',
      exampleAnswer: [{ script: [{ id: 1, arg: ['baz'] }], position: { x: 0, y: 0 } }],
      createdAt: Date.now(),
      updatedAt: undefined,
      indexInGroup: 0,
      imageKey: undefined,
      Author: { id: brandedId.user.entity.parse(ulid()), signInName: 'dummy-user' },
    },
  ];

  const res3 = await questController
    .inject({
      listByQuestGroup: mockedFindManyQuest,
    })(fastify())
    .post({ user, body: { questGroupId: brandedId.questGroup.dto.parse(ulid()) } });

  expect(res3.status).toBe(200);
  expect(res3.body).toHaveLength(1);

  const mockedFindManyQuestGroup = async (
    _: Prisma.TransactionClient,
    _limit?: number,
  ): Promise<QuestGroupEntity[]> => [
    {
      id: brandedId.questGroup.entity.parse(ulid()),
      name: 'foo',
      description: 'bar',
      Author: { id: brandedId.user.entity.parse(ulid()), signInName: 'dummy-user' },
      quests: [],
    },
  ];

  const res4 = await questGroupController
    .inject({ listQuestGroupOrderByUpdatedAt: mockedFindManyQuestGroup })(fastify())
    .get();

  expect(res4.status).toBe(200);
  expect(res4.body).toHaveLength(1);
});
