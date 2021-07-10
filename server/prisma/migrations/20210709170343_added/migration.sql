/*
  Warnings:

  - Added the required column `mal_id` to the `Watch_later` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Watch_later" ADD COLUMN     "mal_id" INTEGER NOT NULL;
