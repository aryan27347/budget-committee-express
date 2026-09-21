/*
  Warnings:

  - You are about to drop the column `loanAmount` on the `members` table. All the data in the column will be lost.
  - You are about to drop the column `shareAmount` on the `members` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "members" DROP COLUMN "loanAmount",
DROP COLUMN "shareAmount",
ADD COLUMN     "loan_amount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "share_amount" INTEGER NOT NULL DEFAULT 0;
