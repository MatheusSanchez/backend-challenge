/*
  Warnings:

  - Added the required column `comparators` to the `Policy` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Policy" ADD COLUMN     "comparators" JSONB NOT NULL;
