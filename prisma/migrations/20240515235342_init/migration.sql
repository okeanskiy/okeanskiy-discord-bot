-- CreateTable
CREATE TABLE "submissions" (
    "submission_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "message_id" TEXT,
    "user_id" TEXT,
    "likes" INTEGER DEFAULT 0,
    CONSTRAINT "submissions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "users" (
    "db_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "user_id" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "submissions_message_id_key" ON "submissions"("message_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_user_id_key" ON "users"("user_id");
