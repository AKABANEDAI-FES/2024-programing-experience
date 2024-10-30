import type {
  Character,
  Phrase,
  PhraseGroup,
  Prisma,
  Quest,
  QuestGroup,
  User,
} from '@prisma/client';
import { toCharacterEntity } from 'domain/character/repository/characterQuery';
import { toGroupEntityWithoutQuest } from 'domain/phrase/repository/phraseQuery';
import { brandedId } from 'service/brandedId';
import { depend } from 'velona';
import type { QuestGroupEntity } from '../model/questGroupType';
import type { QuestBigEntity, QuestEntity } from '../model/questType';
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

const toBigEntity = async (
  prismaQuest: Quest & { Author: User } & {
    phraseGroups: (PhraseGroup & { phrases: Phrase[] })[];
    characters: Character[];
  },
): Promise<QuestBigEntity> => ({
  ...toEntity(prismaQuest),
  phraseGroups: await Promise.all(prismaQuest.phraseGroups.map(toGroupEntityWithoutQuest)),
  characters: await Promise.all(prismaQuest.characters.map(toCharacterEntity)),
});

const toQuestGroupEntity = (
  prismaQuestGroup: QuestGroup & { quests: (Quest & { Author: User })[] } & { Author: User },
): QuestGroupEntity => ({
  id: brandedId.questGroup.entity.parse(prismaQuestGroup.id),
  name: prismaQuestGroup.name,
  description: prismaQuestGroup.description,
  Author: {
    id: brandedId.user.entity.parse(prismaQuestGroup.authorId),
    signInName: prismaQuestGroup.Author.signInName,
  },
  quests: prismaQuestGroup.quests.map(toEntity),
});

const listByQuestGroup = async (
  tx: Prisma.TransactionClient,
  questGroupId: string,
): Promise<QuestEntity[]> => {
  const prismaQuests = await tx.questGroup.findUnique({ where: { id: questGroupId } }).quests({
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
      quests: {
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
        quests: {
          some: {
            id: questId,
          },
        },
      },
    })
    .quests({
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
      quests: {
        include: { Author: true },
      },
      Author: true,
    },
  });
  return prismaQuestGroups
    .sort(
      (a, b) =>
        Math.min(...b.quests.map((v) => v.updatedAt?.getTime() ?? v.createdAt.getTime())) -
        Math.min(...a.quests.map((v) => v.updatedAt?.getTime() ?? v.createdAt.getTime())),
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
      quests: {
        some: {
          id: questId,
        },
      },
    },
    include: {
      quests: {
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
  findById: async (tx: Prisma.TransactionClient, questId: string): Promise<QuestBigEntity> =>
    tx.quest
      .findUniqueOrThrow({
        where: { id: questId },
        include: {
          Author: true,
          phraseGroups: {
            include: {
              phrases: {
                orderBy: { indexInGroup: 'asc' },
              },
            },
          },
          characters: true,
        },
      })
      .then(toBigEntity),
  findQuestGroupById: async (
    tx: Prisma.TransactionClient,
    questGroupId: string,
  ): Promise<QuestGroupEntity> =>
    tx.questGroup
      .findUniqueOrThrow({
        where: { id: questGroupId },
        include: {
          quests: {
            include: { Author: true },
          },
          Author: true,
        },
      })
      .then(toQuestGroupEntity),
  findQuestGroupByQuestId,
};
