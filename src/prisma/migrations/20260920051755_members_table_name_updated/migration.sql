/*
  Warnings:

  - You are about to drop the `Member` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Member";

-- CreateTable
CREATE TABLE "members" (
    "memberId" INTEGER NOT NULL,
    "fullName" VARCHAR(100) NOT NULL,
    "fatherName" VARCHAR(100) NOT NULL,
    "address" VARCHAR(255) NOT NULL,
    "phoneNumber" VARCHAR(10) NOT NULL,
    "alternateNumber" VARCHAR(10),
    "dateOfBirth" VARCHAR(10) NOT NULL,
    "shareAmount" INTEGER NOT NULL DEFAULT 0,
    "loanAmount" INTEGER NOT NULL DEFAULT 0,
    "membershipFees" INTEGER NOT NULL DEFAULT 0,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "pin" TEXT NOT NULL,

    CONSTRAINT "members_pkey" PRIMARY KEY ("memberId")
);

-- CreateIndex
CREATE UNIQUE INDEX "members_memberId_key" ON "members"("memberId");

-- CreateIndex
CREATE UNIQUE INDEX "members_phoneNumber_key" ON "members"("phoneNumber");

-- CreateIndex
CREATE INDEX "members_memberId_phoneNumber_idx" ON "members"("memberId", "phoneNumber");
