-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');

-- CreateTable
CREATE TABLE "Member" (
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

    CONSTRAINT "Member_pkey" PRIMARY KEY ("memberId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Member_memberId_key" ON "Member"("memberId");

-- CreateIndex
CREATE UNIQUE INDEX "Member_phoneNumber_key" ON "Member"("phoneNumber");

-- CreateIndex
CREATE INDEX "Member_memberId_phoneNumber_idx" ON "Member"("memberId", "phoneNumber");
