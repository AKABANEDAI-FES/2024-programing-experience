/*
  Warnings:

  - You are about to drop the column `order` on the `PhraseGroup` table. All the data in the column will be lost.
  - Added the required column `indexInGroup` to the `Phrase` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Phrase" ADD COLUMN     "indexInGroup" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "PhraseGroup" DROP COLUMN "order";
