-- CreateTable
CREATE TABLE "Obstacle" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" INTEGER NOT NULL,
    "imageKey" TEXT,
    "questId" TEXT NOT NULL,

    CONSTRAINT "Obstacle_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Obstacle" ADD CONSTRAINT "Obstacle_questId_fkey" FOREIGN KEY ("questId") REFERENCES "Quest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
