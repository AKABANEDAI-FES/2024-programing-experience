import type { Prisma, Quest, QuestGroup, User } from '@prisma/client';
import { brandedId } from 'service/brandedId';
import { depend } from 'velona';
import type { QuestGroupEntity } from '../model/questGroupType';
import type { QuestEntity } from '../model/questType';
import { scriptsValidator } from '../service/questValidator';

const toEntity = (prismaQuest: Quest & { author: User }): QuestEntity => ({
  id: brandedId.quest.entity.parse(prismaQuest.id),
  name: prismaQuest.name,
  description: prismaQuest.description,
  imageKey: prismaQuest.backgroundImageKey ?? undefined,
  exampleAnswer: scriptsValidator.parse(prismaQuest.exampleAnswer),
  createdAt: prismaQuest.createdAt.getTime(),
  updatedAt: prismaQuest.updatedAt?.getTime() ?? undefined,
  indexInGroup: prismaQuest.indexInGroup,
  author: {
    id: brandedId.user.entity.parse(prismaQuest.authorId),
    signInName: prismaQuest.author.signInName,
  },
});

const toQuestGroupEntity = (
  prismaQuestGroup: QuestGroup & { Quest: (Quest & { author: User })[] },
): QuestGroupEntity => ({
  id: brandedId.questGroup.entity.parse(prismaQuestGroup.id),
  name: prismaQuestGroup.name,
  description: prismaQuestGroup.description,
  Quests: prismaQuestGroup.Quest.map(toEntity),
});

const listByQuestGroup = async (
  tx: Prisma.TransactionClient,
  questGroupId: string,
): Promise<QuestEntity[]> => {
  const prismaQuests = await tx.questGroup.findUnique({ where: { id: questGroupId } }).Quest({
    orderBy: { indexInGroup: 'asc' },
    include: { author: true },
  });
  return prismaQuests?.map(toEntity) ?? [];
};

const listByQuestGroupById = async (
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
      include: { author: true },
    });
  return prismaQuests?.map(toEntity) ?? [];
};

const listQuestGroupByUpdatedAt = async (
  tx: Prisma.TransactionClient,
  limit?: number,
): Promise<QuestGroupEntity[]> => {
  const prismaQuestGroups = await tx.questGroup.findMany({
    include: {
      Quest: {
        include: { author: true },
      },
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

export const questQuery = {
  listByQuestGroup,
  listQuestGroupByUpdatedAt,
  listByQuestGroupById,
  findManyWithDI: depend(
    { listByQuestGroup },
    (deps, tx: Prisma.TransactionClient, questGroupId: string): Promise<QuestEntity[]> =>
      deps.listByQuestGroup(tx, questGroupId),
  ),
  findManyQuestGroupWithDI: depend(
    { listQuestGroupByUpdatedAt },
    (deps, tx: Prisma.TransactionClient, limit?: number): Promise<QuestGroupEntity[]> =>
      deps.listQuestGroupByUpdatedAt(tx, limit),
  ),
  findManyQuestGroupByIdWithDI: depend(
    { listByQuestGroupById },
    (deps, tx: Prisma.TransactionClient, questId: string): Promise<QuestEntity[]> =>
      deps.listByQuestGroupById(tx, questId),
  ),
  findById: async (tx: Prisma.TransactionClient, questId: string): Promise<QuestEntity> =>
    tx.quest
      .findUniqueOrThrow({ where: { id: questId }, include: { author: true } })
      .then(toEntity),
  findQuestGroupById: async (
    tx: Prisma.TransactionClient,
    questGroupId: string,
  ): Promise<QuestGroupEntity> =>
    tx.questGroup
      .findUniqueOrThrow({
        where: { id: questGroupId },
        include: {
          Quest: {
            include: { author: true },
          },
        },
      })
      .then(toQuestGroupEntity),
};
