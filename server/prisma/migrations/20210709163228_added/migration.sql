-- CreateTable
CREATE TABLE "Watch_later" (
    "id" SERIAL NOT NULL,
    "user_fk" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "completed" (
    "id" SERIAL NOT NULL,
    "user_fk" INTEGER NOT NULL,
    "mal_id" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "friends" (
    "id" SERIAL NOT NULL,
    "user_fk" INTEGER NOT NULL,
    "user_friend_fk" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "forum" (
    "id" SERIAL NOT NULL,
    "user_fk" INTEGER NOT NULL,
    "comment" TEXT NOT NULL,
    "reply_to" INTEGER,
    "likes" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    PRIMARY KEY ("id")
);
