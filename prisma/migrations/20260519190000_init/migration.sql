-- CreateTable
CREATE TABLE "Flavor" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "flavorProfile" TEXT,
    "imageUrl" TEXT,
    "sourceUrl" TEXT,
    "status" TEXT NOT NULL DEFAULT 'current',
    "accentColor" TEXT NOT NULL DEFAULT '#69ff72',
    "caffeineMg" INTEGER,
    "calories" INTEGER,
    "sugarG" INTEGER,
    "introducedYear" INTEGER,
    "isRecent" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "RankingEntry" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "flavorId" TEXT NOT NULL,
    "bucket" TEXT NOT NULL DEFAULT 'HAVENT_TRIED',
    "position" INTEGER NOT NULL DEFAULT 0,
    "isFavorite" BOOLEAN NOT NULL DEFAULT false,
    "note" TEXT,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "RankingEntry_flavorId_fkey" FOREIGN KEY ("flavorId") REFERENCES "Flavor" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Flavor_slug_key" ON "Flavor"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "RankingEntry_flavorId_key" ON "RankingEntry"("flavorId");
