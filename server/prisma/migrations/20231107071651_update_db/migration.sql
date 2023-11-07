/*
  Warnings:

  - You are about to drop the `_commentReactions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_postReactions` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `title` to the `Post` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ReactionType" AS ENUM ('LIKE', 'UNLIKE');

-- DropForeignKey
ALTER TABLE "_commentReactions" DROP CONSTRAINT "_commentReactions_A_fkey";

-- DropForeignKey
ALTER TABLE "_commentReactions" DROP CONSTRAINT "_commentReactions_B_fkey";

-- DropForeignKey
ALTER TABLE "_postReactions" DROP CONSTRAINT "_postReactions_A_fkey";

-- DropForeignKey
ALTER TABLE "_postReactions" DROP CONSTRAINT "_postReactions_B_fkey";

-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "title" TEXT NOT NULL;

-- DropTable
DROP TABLE "_commentReactions";

-- DropTable
DROP TABLE "_postReactions";

-- CreateTable
CREATE TABLE "PostReaction" (
    "userId" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "type" "ReactionType" NOT NULL,

    CONSTRAINT "PostReaction_pkey" PRIMARY KEY ("userId","postId","type")
);

-- CreateTable
CREATE TABLE "CommentReaction" (
    "userId" TEXT NOT NULL,
    "commentId" TEXT NOT NULL,
    "type" "ReactionType" NOT NULL,

    CONSTRAINT "CommentReaction_pkey" PRIMARY KEY ("userId","commentId","type")
);

-- AddForeignKey
ALTER TABLE "PostReaction" ADD CONSTRAINT "PostReaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostReaction" ADD CONSTRAINT "PostReaction_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommentReaction" ADD CONSTRAINT "CommentReaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommentReaction" ADD CONSTRAINT "CommentReaction_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "Comment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
