/*
  Warnings:

  - Made the column `questGroupId` on table `Quest` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Quest" DROP CONSTRAINT "Quest_questGroupId_fkey";

-- AlterTable
ALTER TABLE "Quest" ALTER COLUMN "questGroupId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Quest" ADD CONSTRAINT "Quest_questGroupId_fkey" FOREIGN KEY ("questGroupId") REFERENCES "QuestGroup"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
