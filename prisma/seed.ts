import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

const members = [
  {
    memberId: 1,
    fullName: "Aryan Jangid",
    fatherName: "Naresh Kumar Suthar",
    address: "84 - Sutharon ka Mohalla, Bus Stand, Pur, Bhilwara",
    phoneNumber: "8955558006",
    alternateNumber: "7230926320",
    dateOfBirth: "2001-09-09",
    shareAmount: 161000,
    loanAmount: 52000,
    membershipFees: 500,
    role: Role.ADMIN,
    pin: "7347",
  },
];

async function main() {
  console.log("🌱 Starting seed...");

  for (const member of members) {
    const hashedPin = await bcrypt.hash(member.pin, 10);

    await prisma.member.upsert({
      where: { memberId: member.memberId },
      update: {},
      create: {
        memberId: member.memberId,
        fullName: member.fullName,
        fatherName: member.fatherName,
        address: member.address,
        phoneNumber: member.phoneNumber,
        alternateNumber: member.alternateNumber,
        dateOfBirth: member.dateOfBirth,
        shareAmount: member.shareAmount,
        loanAmount: member.loanAmount,
        membershipFees: member.membershipFees,
        role: member.role,
        pin: hashedPin,
      },
    });

    console.log(
      `✅ Seeded member: ${member.fullName} (ID: ${member.memberId})`,
    );
  }

  console.log("🎉 Seed complete!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
