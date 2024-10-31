/*
  Warnings:

  - Added the required column `userId` to the `Quest` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "KatetegoriEnum" AS ENUM ('BEFORE_QUEST', 'AFTER_QUEST_OK', 'AFTER_QUEST_FAIL');

-- AlterTable
ALTER TABLE "Quest" ADD COLUMN     "userId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "PhraseGroup" (
    "id" TEXT NOT NULL,
    "order" JSONB NOT NULL,
    "category" "KatetegoriEnum" NOT NULL,
    "backgroundImgKey" TEXT,
    "questId" TEXT,

    CONSTRAINT "PhraseGroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Phrase" (
    "id" TEXT NOT NULL,
    "phrase" TEXT NOT NULL,
    "phraseGroupId" TEXT,

    CONSTRAINT "Phrase_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Quest" ADD CONSTRAINT "Quest_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PhraseGroup" ADD CONSTRAINT "PhraseGroup_questId_fkey" FOREIGN KEY ("questId") REFERENCES "Quest"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Phrase" ADD CONSTRAINT "Phrase_phraseGroupId_fkey" FOREIGN KEY ("phraseGroupId") REFERENCES "PhraseGroup"("id") ON DELETE SET NULL ON UPDATE CASCADE;
