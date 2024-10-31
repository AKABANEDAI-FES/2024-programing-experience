-- AlterTable
ALTER TABLE "Quest" ADD COLUMN     "questGroupId" TEXT;

-- CreateTable
CREATE TABLE "QuestGroup" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "order" JSONB NOT NULL,

    CONSTRAINT "QuestGroup_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Quest" ADD CONSTRAINT "Quest_questGroupId_fkey" FOREIGN KEY ("questGroupId") REFERENCES "QuestGroup"("id") ON DELETE SET NULL ON UPDATE CASCADE;
