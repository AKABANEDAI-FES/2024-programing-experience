/*
  Warnings:

  - Added the required column `isAdmin` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `language` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "LanguageEnum" AS ENUM ('KANJI', 'HIRAGANA', 'ENGLISH');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "isAdmin" BOOLEAN NOT NULL default false,
ADD COLUMN     "language" "LanguageEnum" NOT NULL default 'KANJI';

-- CreateTable
CREATE TABLE "Quest" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "backgroundImageKey" TEXT,
    "exampleAnswer" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Quest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserQuest" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "questId" TEXT NOT NULL,

    CONSTRAINT "UserQuest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserQuestResult" (
    "id" TEXT NOT NULL,
    "userQuestId" TEXT NOT NULL,
    "startAt" TIMESTAMP(3) NOT NULL,
    "endAt" TIMESTAMP(3) NOT NULL,
    "score" INTEGER NOT NULL,
    "answer" JSONB NOT NULL,

    CONSTRAINT "UserQuestResult_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Quest" ADD CONSTRAINT "Quest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserQuest" ADD CONSTRAINT "UserQuest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserQuest" ADD CONSTRAINT "UserQuest_questId_fkey" FOREIGN KEY ("questId") REFERENCES "Quest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserQuestResult" ADD CONSTRAINT "UserQuestResult_userQuestId_fkey" FOREIGN KEY ("userQuestId") REFERENCES "UserQuest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
