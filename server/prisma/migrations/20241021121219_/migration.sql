/*
  Warnings:

  - You are about to drop the column `order` on the `QuestGroup` table. All the data in the column will be lost.
  - Added the required column `indexInGroup` to the `Quest` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Quest" ADD COLUMN     "indexInGroup" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "QuestGroup" DROP COLUMN "order";
