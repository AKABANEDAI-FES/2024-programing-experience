import type { Phrase, PhraseGroup, Prisma, Quest } from '@prisma/client';
import type { MaybeId } from 'common/types/brandedId';
import { brandedId } from 'service/brandedId';
import { depend } from 'velona';
import type { PhraseGroupEntity } from '../model/phraseGroupType';
import type { PhraseEntity } from '../model/phraseType';

export const toPhraseEntity = (prismaPhrase: Phrase): PhraseEntity => ({
  id: brandedId.phrase.entity.parse(prismaPhrase.id),
  phrase: prismaPhrase.phrase,
  indexInGroup: prismaPhrase.indexInGroup,
  phraseGroupId: brandedId.phraseGroup.entity.parse(prismaPhrase.phraseGroupId),
});

const toPhraseGroupEntity = async (
  prismaPhraseGroup: PhraseGroup & { Phrases: Phrase[]; Quest: Quest | null },
): Promise<PhraseGroupEntity> => ({
  id: brandedId.phraseGroup.entity.parse(prismaPhraseGroup.id),
  backgroundImageKey: prismaPhraseGroup.backgroundImgKey ?? undefined,
  quest:
    prismaPhraseGroup.Quest === null
      ? null
      : {
          id: brandedId.quest.entity.parse(prismaPhraseGroup.questId),
          name: prismaPhraseGroup.Quest.name,
        },
  category: prismaPhraseGroup.category,
  Phrases: await Promise.all(prismaPhraseGroup.Phrases.map(toPhraseEntity)),
});

const listByGroupId = async (
  tx: Prisma.TransactionClient,
  phraseGroupId: string,
): Promise<PhraseEntity[]> => {
  const phrases = await tx.phrase.findMany({
    where: { phraseGroupId },
    orderBy: { indexInGroup: 'asc' },
  });
  return phrases.map(toPhraseEntity);
};

export const phraseQuery = {
  listByGroupId,
  findById: async (tx: Prisma.TransactionClient, phraseId: string): Promise<PhraseEntity> => {
    const phrase = await tx.phrase.findUniqueOrThrow({
      where: { id: phraseId },
    });
    return toPhraseEntity(phrase);
  },
  findByGroupId: async (
    tx: Prisma.TransactionClient,
    questGroupId: MaybeId['phraseGroup'],
  ): Promise<PhraseGroupEntity> =>
    tx.phraseGroup
      .findUniqueOrThrow({ where: { id: questGroupId }, include: { Phrases: true, Quest: true } })
      .then(toPhraseGroupEntity),

  listByGroupIdWithDI: depend(
    { listByGroupId },
    (deps, tx: Prisma.TransactionClient, phraseGroupId: string): Promise<PhraseEntity[]> =>
      deps.listByGroupId(tx, phraseGroupId),
  ),
};
