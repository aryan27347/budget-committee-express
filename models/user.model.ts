export interface UserDataType {
  memberId: number;
  fullName: string;
  fatherName: string;
  address: string;
  phoneNumber: string;
  alternateNumber: string;
  dateOfBirth: string;
  shareAmount: number;
  loanAmount: number;
  membershipFees: number;
  role: "admin" | "user";
  pin?: string;
}
