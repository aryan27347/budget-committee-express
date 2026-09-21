/*
  Warnings:

  - The primary key for the `members` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `alternateNumber` on the `members` table. All the data in the column will be lost.
  - You are about to drop the column `dateOfBirth` on the `members` table. All the data in the column will be lost.
  - You are about to drop the column `fatherName` on the `members` table. All the data in the column will be lost.
  - You are about to drop the column `fullName` on the `members` table. All the data in the column will be lost.
  - You are about to drop the column `memberId` on the `members` table. All the data in the column will be lost.
  - You are about to drop the column `membershipFees` on the `members` table. All the data in the column will be lost.
  - You are about to drop the column `phoneNumber` on the `members` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[member_id]` on the table `members` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[phone_number]` on the table `members` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `dob` to the `members` table without a default value. This is not possible if the table is not empty.
  - Added the required column `father_name` to the `members` table without a default value. This is not possible if the table is not empty.
  - Added the required column `full_name` to the `members` table without a default value. This is not possible if the table is not empty.
  - Added the required column `member_id` to the `members` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone_number` to the `members` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "members_memberId_key";

-- DropIndex
DROP INDEX "members_memberId_phoneNumber_idx";

-- DropIndex
DROP INDEX "members_phoneNumber_key";

-- AlterTable
ALTER TABLE "members" DROP CONSTRAINT "members_pkey",
DROP COLUMN "alternateNumber",
DROP COLUMN "dateOfBirth",
DROP COLUMN "fatherName",
DROP COLUMN "fullName",
DROP COLUMN "memberId",
DROP COLUMN "membershipFees",
DROP COLUMN "phoneNumber",
ADD COLUMN     "alternate_number" VARCHAR(10),
ADD COLUMN     "dob" VARCHAR(10) NOT NULL,
ADD COLUMN     "father_name" VARCHAR(100) NOT NULL,
ADD COLUMN     "full_name" VARCHAR(100) NOT NULL,
ADD COLUMN     "member_id" INTEGER NOT NULL,
ADD COLUMN     "membership_fees" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "phone_number" VARCHAR(10) NOT NULL,
ADD CONSTRAINT "members_pkey" PRIMARY KEY ("member_id");

-- CreateIndex
CREATE UNIQUE INDEX "members_member_id_key" ON "members"("member_id");

-- CreateIndex
CREATE UNIQUE INDEX "members_phone_number_key" ON "members"("phone_number");

-- CreateIndex
CREATE INDEX "members_member_id_phone_number_idx" ON "members"("member_id", "phone_number");
