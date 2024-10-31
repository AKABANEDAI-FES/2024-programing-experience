-- DropForeignKey
ALTER TABLE "Obstacle" DROP CONSTRAINT "Obstacle_questId_fkey";

-- DropForeignKey
ALTER TABLE "PhraseGroup" DROP CONSTRAINT "PhraseGroup_questId_fkey";

-- AddForeignKey
ALTER TABLE "PhraseGroup" ADD CONSTRAINT "PhraseGroup_questId_fkey" FOREIGN KEY ("questId") REFERENCES "Quest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Obstacle" ADD CONSTRAINT "Obstacle_questId_fkey" FOREIGN KEY ("questId") REFERENCES "Quest"("id") ON DELETE CASCADE ON UPDATE CASCADE;
