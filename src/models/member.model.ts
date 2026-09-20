import { Role } from "@prisma/client";

export interface MemberDataType {
  memberId: number;
  fullName: string;
  fatherName: string;
  address: string;
  phoneNumber: string;
  alternateNumber?: string | null;
  dateOfBirth: string;
  shareAmount: number;
  loanAmount: number;
  membershipFees: number;
  role: Role;
  pin?: string;
}
