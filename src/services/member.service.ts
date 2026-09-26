import { NextFunction, Request, Response } from "express";
import prisma from "../lib/prisma";
import { MemberDataType } from "../models/member.model";

export class MemberService {
  public async getAllMembers(): Promise<MemberDataType[]> {
    try {
      return await prisma.member.findMany({
        omit: {
          pin: true,
        },
      });
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  public async findMemberById(
    memberId: number | string,
  ): Promise<MemberDataType | null> {
    try {
      return await prisma.member.findFirst({
        where: {
          memberId: Number(memberId),
        },
        omit: {
          pin: true,
        },
      });
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  public async findMember(
    memberId: number | string,
    phoneNumber: string,
  ): Promise<Pick<MemberDataType, "memberId" | "phoneNumber">[]> {
    try {
      return await prisma.member.findMany({
        where: {
          OR: [
            {
              memberId: Number(memberId),
            },
            { phoneNumber },
          ],
        },
        select: {
          memberId: true,
          phoneNumber: true,
        },
      });
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  public async createMember(payload: MemberDataType): Promise<MemberDataType> {
    try {
      return await prisma.member.create({
        data: {
          memberId: Number(payload.memberId),
          fullName: payload.fullName,
          fatherName: payload.fatherName,
          address: payload.address,
          phoneNumber: payload.phoneNumber,
          alternateNumber: payload.alternateNumber,
          dateOfBirth: payload.dateOfBirth,
          shareAmount: Number(payload.shareAmount),
          loanAmount: Number(payload.loanAmount),
          membershipFees: Number(payload.membershipFees),
          role: "USER",
          pin: payload.pin!,
        },
        omit: {
          pin: true,
        },
      });
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  public async checkMember(
    phoneNumber: string,
  ): Promise<MemberDataType | null> {
    try {
      return await prisma.member.findFirst({
        where: {
          phoneNumber,
        },
      });
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  public async updateMember(
    payload: Partial<MemberDataType>,
  ): Promise<MemberDataType> {
    try {
      return await prisma.member.update({
        where: {
          memberId: Number(payload.memberId),
        },
        data: {
          fullName: payload.fullName,
          fatherName: payload.fatherName,
          address: payload.address,
          phoneNumber: payload.phoneNumber,
          alternateNumber: payload.alternateNumber,
          dateOfBirth: payload.dateOfBirth,
        },
        omit: {
          pin: true,
        },
      });
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  public async deleteMember(memberId: number): Promise<void> {
    try {
      await prisma.member.delete({
        where: {
          memberId: Number(memberId),
        },
      });
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
