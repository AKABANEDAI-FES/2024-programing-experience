import type { Phrase, PhraseGroup, Prisma, Quest, QuestGroup, User } from '@prisma/client';
import { toGroupEntityWithoutQuest } from 'domain/phrase/repository/phraseQuery';
import { brandedId } from 'service/brandedId';
import { depend } from 'velona';
import type { QuestGroupEntity } from '../model/questGroupType';
import type { QuestEntity, QuestEntityWithPhrases } from '../model/questType';
import { scriptsValidator } from '../service/questValidator';

const toEntity = (prismaQuest: Quest & { Author: User }): QuestEntity => ({
  id: brandedId.quest.entity.parse(prismaQuest.id),
  name: prismaQuest.name,
  description: prismaQuest.description,
  imageKey: prismaQuest.backgroundImageKey ?? undefined,
  exampleAnswer: scriptsValidator.parse(prismaQuest.exampleAnswer),
  createdAt: prismaQuest.createdAt.getTime(),
  updatedAt: prismaQuest.updatedAt?.getTime() ?? undefined,
  indexInGroup: prismaQuest.indexInGroup,
  Author: {
    id: brandedId.user.entity.parse(prismaQuest.authorId),
    signInName: prismaQuest.Author.signInName,
  },
});

const toEntityWithPhrases = async (
  prismaQuest: Quest & { Author: User } & {
    PhraseGroup: (PhraseGroup & { Phrases: Phrase[] })[];
  },
): Promise<QuestEntityWithPhrases> => ({
  ...toEntity(prismaQuest),
  Phrases: await Promise.all(prismaQuest.PhraseGroup.map(toGroupEntityWithoutQuest)),
});

const toQuestGroupEntity = (
  prismaQuestGroup: QuestGroup & { Quest: (Quest & { Author: User })[] } & { Author: User },
): QuestGroupEntity => ({
  id: brandedId.questGroup.entity.parse(prismaQuestGroup.id),
  name: prismaQuestGroup.name,
  description: prismaQuestGroup.description,
  Author: {
    id: brandedId.user.entity.parse(prismaQuestGroup.authorId),
    signInName: prismaQuestGroup.Author.signInName,
  },
  Quests: prismaQuestGroup.Quest.map(toEntity),
});

const listByQuestGroup = async (
  tx: Prisma.TransactionClient,
  questGroupId: string,
): Promise<QuestEntity[]> => {
  const prismaQuests = await tx.questGroup.findUnique({ where: { id: questGroupId } }).Quest({
    orderBy: { indexInGroup: 'asc' },
    include: { Author: true },
  });
  return prismaQuests?.map(toEntity) ?? [];
};

const listQuestGroupByAuthorId = async (
  tx: Prisma.TransactionClient,
  authorId: string,
): Promise<QuestGroupEntity[]> => {
  const prismaQuestGroups = await tx.questGroup.findMany({
    where: { authorId },
    include: {
      Quest: {
        include: { Author: true },
      },
      Author: true,
    },
  });
  return prismaQuestGroups.map(toQuestGroupEntity);
};

const listQuestGroupById = async (
  tx: Prisma.TransactionClient,
  questId: string,
): Promise<QuestEntity[]> => {
  const prismaQuests = await tx.questGroup
    .findFirst({
      where: {
        Quest: {
          some: {
            id: questId,
          },
        },
      },
    })
    .Quest({
      orderBy: { indexInGroup: 'asc' },
      include: { Author: true },
    });
  return prismaQuests?.map(toEntity) ?? [];
};

const listQuestGroupOrderByUpdatedAt = async (
  tx: Prisma.TransactionClient,
  limit?: number,
): Promise<QuestGroupEntity[]> => {
  const prismaQuestGroups = await tx.questGroup.findMany({
    include: {
      Quest: {
        include: { Author: true },
      },
      Author: true,
    },
  });
  return prismaQuestGroups
    .sort(
      (a, b) =>
        Math.min(...b.Quest.map((v) => v.updatedAt?.getTime() ?? v.createdAt.getTime())) -
        Math.min(...a.Quest.map((v) => v.updatedAt?.getTime() ?? v.createdAt.getTime())),
    )
    .slice(0, limit)
    .map(toQuestGroupEntity);
};

const findQuestGroupByQuestId = async (
  tx: Prisma.TransactionClient,
  questId: string,
): Promise<QuestGroupEntity | null> => {
  const prismaQuestGroup = await tx.questGroup.findFirst({
    where: {
      Quest: {
        some: {
          id: questId,
        },
      },
    },
    include: {
      Quest: {
        include: { Author: true },
      },
      Author: true,
    },
  });
  return prismaQuestGroup ? toQuestGroupEntity(prismaQuestGroup) : null;
};
export const questQuery = {
  listByQuestGroup,
  listQuestGroupOrderByUpdatedAt,
  listQuestGroupById,
  listQuestGroupByAuthorId,
  findManyWithDI: depend(
    { listByQuestGroup },
    (deps, tx: Prisma.TransactionClient, questGroupId: string): Promise<QuestEntity[]> =>
      deps.listByQuestGroup(tx, questGroupId),
  ),
  findManyQuestGroupWithDI: depend(
    { listQuestGroupOrderByUpdatedAt },
    (deps, tx: Prisma.TransactionClient, limit?: number): Promise<QuestGroupEntity[]> =>
      deps.listQuestGroupOrderByUpdatedAt(tx, limit),
  ),
  findById: async (
    tx: Prisma.TransactionClient,
    questId: string,
  ): Promise<QuestEntityWithPhrases> =>
    tx.quest
      .findUniqueOrThrow({
        where: { id: questId },
        include: {
          Author: true,
          PhraseGroup: {
            include: {
              Phrases: {
                orderBy: { indexInGroup: 'asc' },
              },
            },
          },
        },
      })
      .then(toEntityWithPhrases),
  findQuestGroupById: async (
    tx: Prisma.TransactionClient,
    questGroupId: string,
  ): Promise<QuestGroupEntity> =>
    tx.questGroup
      .findUniqueOrThrow({
        where: { id: questGroupId },
        include: {
          Quest: {
            include: { Author: true },
          },
          Author: true,
        },
      })
      .then(toQuestGroupEntity),
  findQuestGroupByQuestId,
};
