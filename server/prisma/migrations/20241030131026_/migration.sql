/*
  Warnings:

  - Made the column `phraseGroupId` on table `Phrase` required. This step will fail if there are existing NULL values in that column.
  - Made the column `questId` on table `PhraseGroup` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Phrase" DROP CONSTRAINT "Phrase_phraseGroupId_fkey";

-- DropForeignKey
ALTER TABLE "PhraseGroup" DROP CONSTRAINT "PhraseGroup_questId_fkey";

-- AlterTable
ALTER TABLE "Phrase" ALTER COLUMN "phraseGroupId" SET NOT NULL;

-- AlterTable
ALTER TABLE "PhraseGroup" ALTER COLUMN "questId" SET NOT NULL;

-- CreateTable
CREATE TABLE "Character" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "imageKey" TEXT,
    "questId" TEXT NOT NULL,

    CONSTRAINT "Character_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PhraseGroup" ADD CONSTRAINT "PhraseGroup_questId_fkey" FOREIGN KEY ("questId") REFERENCES "Quest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Phrase" ADD CONSTRAINT "Phrase_phraseGroupId_fkey" FOREIGN KEY ("phraseGroupId") REFERENCES "PhraseGroup"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Character" ADD CONSTRAINT "Character_questId_fkey" FOREIGN KEY ("questId") REFERENCES "Quest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
