import { Request, Response, NextFunction } from "express";
import { MemberDataType } from "../models/member.model";
import { MemberService } from "../services/member.service";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export class MemberController {
  private memberService = new MemberService();

  public getAllMembers = async (
    req: Request<{}, {}, MemberDataType>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const members = await this.memberService.getAllMembers();
      return res.status(200).json({ members });
    } catch (error) {
      console.log(error);
      next(error);
    }
  };

  public getMember = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      const member = await this.memberService.findMemberById(id as string);
      if (!member) {
        return res.status(400).json({ error: "Member not found" });
      }
      return res.status(200).json({ ...member });
    } catch (error) {
      console.log(error);
      res.status(400).json({ error });
    }
  };

  public registerMember = async (
    req: Request<{}, {}, MemberDataType>,
    res: Response,
  ) => {
    const pin = "1234";
    const { memberId, phoneNumber } = req.body;

    if (!phoneNumber || !pin) {
      return res
        .status(400)
        .json({ error: "Phone number and PIN are required" });
    }

    if (phoneNumber.length !== 10) {
      return res
        .status(400)
        .json({ error: "Please enter correct phone number" });
    }

    if (pin.length !== 4) {
      return res.status(400).json({ error: "PIN must be 4 digits" });
    }

    // Check if member already exists
    const memberExists = await this.memberService.findMember(
      memberId,
      phoneNumber,
    );

    if (memberExists.length > 0) {
      return res.status(400).json({ error: "Member already exists" });
    }

    // Hash the PIN
    const hashedPassword = bcrypt.hashSync(pin, 10);

    const JWT_SECRET = process.env.JWT_SECRET;

    if (!JWT_SECRET) {
      throw new Error("JWT_SECRET is not configured");
    }

    try {
      const member = await this.memberService.createMember({
        ...req.body,
        pin: hashedPassword,
      });
      res.json({ member });
    } catch (error) {
      res.status(400).json({ error });
    }
  };

  public login = async (req: Request, res: Response) => {
    const { phoneNumber } = req.body;
    const memberPin = req.body.pin;

    if (!phoneNumber || !memberPin) {
      return res
        .status(400)
        .json({ error: "Phone number and PIN are required" });
    }

    if (phoneNumber.length !== 10) {
      return res
        .status(400)
        .json({ error: "Please enter correct phone number" });
    }

    if (memberPin.length !== 4) {
      return res.status(400).json({ error: "PIN must be 4 digits" });
    }

    let memberData;
    try {
      memberData = await this.memberService.checkMember(phoneNumber);
    } catch (error) {
      console.log(error);
      res.status(400).json({ error });
    }

    if (!memberData) {
      return res.status(400).json({ error: "Member not found" });
    }

    const isPinValid = bcrypt.compareSync(memberPin, memberData.pin as string);

    if (!isPinValid) {
      return res.status(400).json({ error: "Invalid PIN" });
    }

    const { pin, ...payload } = memberData;

    // Generate JWT token
    const JWT_SECRET = process.env.JWT_SECRET;

    if (!JWT_SECRET) {
      throw new Error("JWT_SECRET is not configured");
    }

    const token = jwt.sign({ memberId: payload.memberId }, JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({ token, member: payload });
  };

  public updateMember = async (req: Request, res: Response) => {
    const {
      memberId,
      fullName,
      fatherName,
      address,
      phoneNumber,
      alternateNumber,
      dateOfBirth,
    } = req.body;

    if (
      !memberId ||
      !fullName ||
      !fatherName ||
      !address ||
      !phoneNumber ||
      !alternateNumber ||
      !dateOfBirth
    ) {
      return res.status(400).json({ error: "All fields are required" });
    }

    let memberExists;
    try {
      memberExists = await this.memberService.checkMember(phoneNumber);
    } catch (error) {
      console.log(error);
      res.status(400).json({ error });
    }

    if (!memberExists) {
      return res.status(400).json({ error: "Member not found" });
    }

    try {
      const member = await this.memberService.updateMember({
        memberId,
        fullName,
        fatherName,
        address,
        phoneNumber,
        alternateNumber,
        dateOfBirth,
      });
      res.json({ member });
    } catch (error) {
      console.log(error);
      res.status(400).json({ error });
    }
  };

  public deleteUser = async (req: Request, res: Response) => {
    const { memberId } = req.body;

    if (!memberId) {
      return res.json({ error: "Member Id is required" });
    }

    try {
      await this.memberService.deleteMember(memberId);
      res.json({ message: "Member deleted successfully" });
    } catch (error) {
      console.log(error);
      res.json({ error });
    }
  };
}
