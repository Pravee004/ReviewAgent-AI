-- CreateTable
CREATE TABLE "Repository" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "githubUrl" TEXT,
    "status" TEXT NOT NULL,
    "analyzedPrs" INTEGER NOT NULL DEFAULT 0,
    "lastSync" TEXT NOT NULL,
    "error" TEXT
);

-- CreateTable
CREATE TABLE "PullRequest" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "repoId" INTEGER NOT NULL,
    "prNumber" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "risk" TEXT,
    "time" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "PullRequest_repoId_fkey" FOREIGN KEY ("repoId") REFERENCES "Repository" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Finding" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "prId" INTEGER NOT NULL,
    "severity" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "fileName" TEXT,
    "lineNumber" INTEGER,
    "description" TEXT NOT NULL,
    "fixSuggestion" TEXT,
    CONSTRAINT "Finding_prId_fkey" FOREIGN KEY ("prId") REFERENCES "PullRequest" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Setting" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Repository_name_key" ON "Repository"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Setting_key_key" ON "Setting"("key");
