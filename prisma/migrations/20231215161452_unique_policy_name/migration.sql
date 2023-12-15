/*
  Warnings:

  - You are about to drop the column `name` on the `Policy` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[policyName]` on the table `Policy` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `policyName` to the `Policy` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Policy" DROP COLUMN "name",
ADD COLUMN     "policyName" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Policy_policyName_key" ON "Policy"("policyName");
