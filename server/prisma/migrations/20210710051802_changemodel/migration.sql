/*
  Warnings:

  - Added the required column `mal_id` to the `forum` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "forum" ADD COLUMN     "mal_id" INTEGER NOT NULL;
