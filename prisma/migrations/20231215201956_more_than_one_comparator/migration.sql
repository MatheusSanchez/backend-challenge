/*
  Warnings:

  - The `comparators` column on the `Policy` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Policy" DROP COLUMN "comparators",
ADD COLUMN     "comparators" JSONB[];
