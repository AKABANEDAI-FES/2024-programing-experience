/*
  Warnings:

  - Added the required column `authorId` to the `QuestGroup` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Quest" DROP CONSTRAINT "Quest_authorId_fkey";

-- AlterTable
ALTER TABLE "QuestGroup" ADD COLUMN     "authorId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "QuestGroup" ADD CONSTRAINT "QuestGroup_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
