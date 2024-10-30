import type { Phrase, PhraseGroup, Prisma, Quest } from '@prisma/client';
import type { StrictOmit } from 'common/types';
import type { MaybeId } from 'common/types/brandedId';
import { brandedId } from 'service/brandedId';
import { depend } from 'velona';
import type { PhraseGroupEntity } from '../model/phraseGroupType';
import type { PhraseEntity } from '../model/phraseType';

export const toEntity = (prismaPhrase: Phrase): PhraseEntity => ({
  id: brandedId.phrase.entity.parse(prismaPhrase.id),
  phrase: prismaPhrase.phrase,
  indexInGroup: prismaPhrase.indexInGroup,
  phraseGroupId: brandedId.phraseGroup.entity.parse(prismaPhrase.phraseGroupId),
});

export const toGroupEntityWithoutQuest = async (
  prismaPhraseGroup: PhraseGroup & { phrases: Phrase[] },
): Promise<StrictOmit<PhraseGroupEntity, 'quest'>> => ({
  id: brandedId.phraseGroup.entity.parse(prismaPhraseGroup.id),
  backgroundImageKey: prismaPhraseGroup.backgroundImgKey ?? undefined,
  category: prismaPhraseGroup.category,
  Phrases: prismaPhraseGroup.phrases.map(toEntity),
});
export const toGroupEntity = async (
  prismaPhraseGroup: PhraseGroup & { phrases: Phrase[]; Quest: Quest | null },
): Promise<PhraseGroupEntity> => ({
  ...(await toGroupEntityWithoutQuest(prismaPhraseGroup)),
  quest:
    prismaPhraseGroup.Quest === null
      ? null
      : {
          id: brandedId.quest.entity.parse(prismaPhraseGroup.questId),
          name: prismaPhraseGroup.Quest.name,
        },
});

const listByGroupId = async (
  tx: Prisma.TransactionClient,
  phraseGroupId: string,
): Promise<PhraseEntity[]> => {
  const phrases = await tx.phrase.findMany({
    where: { phraseGroupId },
    orderBy: { indexInGroup: 'asc' },
  });
  return phrases.map(toEntity);
};

export const phraseQuery = {
  listByGroupId,
  findById: async (tx: Prisma.TransactionClient, phraseId: string): Promise<PhraseEntity> => {
    const phrase = await tx.phrase.findUniqueOrThrow({
      where: { id: phraseId },
    });
    return toEntity(phrase);
  },
  findByGroupId: async (
    tx: Prisma.TransactionClient,
    questGroupId: MaybeId['phraseGroup'],
  ): Promise<PhraseGroupEntity> =>
    tx.phraseGroup
      .findUniqueOrThrow({ where: { id: questGroupId }, include: { phrases: true, Quest: true } })
      .then(toGroupEntity),

  listByGroupIdWithDI: depend(
    { listByGroupId },
    (deps, tx: Prisma.TransactionClient, phraseGroupId: string): Promise<PhraseEntity[]> =>
      deps.listByGroupId(tx, phraseGroupId),
  ),
};
