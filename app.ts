import "dotenv/config";
import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import fs from "fs";
import path from "path";
import cors from "cors";
import headersMiddleware from "./middlewares/headers.middleware";
import authMiddleware from "./middlewares/auth.middleware";
import { UserDataType } from "./models/user.model";
import prisma from "./prisma";

const app = express();
const filePath = path.join(__dirname, "mockData", "users.json");

app.use(express.json({ strict: false }));
app.use(cors());
app.use(headersMiddleware);

async function readUsersData(): Promise<UserDataType[]> {
  try {
    const data = await fs.promises.readFile(filePath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.log(error);
    return [];
  }
}

async function writeUsersData(data: UserDataType[]) {
  try {
    await fs.promises.writeFile(filePath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.log(error);
  }
}

app.get("/", (req, res) => {
  res.send("Welcome to the Budget Committee Backend!");
});

app.post("/user/register", async (req, res) => {
  const usersData = await readUsersData();
  const pin = "1234";

  const {
    memberId,
    fullName,
    fatherName,
    address,
    phoneNumber,
    alternateNumber,
    dateOfBirth,
    shareAmount,
    loanAmount,
    membershipFees,
  } = req.body;

  if (!phoneNumber || !pin) {
    return res.status(400).json({ error: "Phone number and PIN are required" });
  }

  if (phoneNumber.length !== 10) {
    return res.status(400).json({ error: "Please enter correct phone number" });
  }

  if (pin.length !== 4) {
    return res.status(400).json({ error: "PIN must be 4 digits" });
  }

  // Check if user already exists
  const userExists = await prisma.member.findMany({
    where: {
      OR: [
        {
          memberId: Number(memberId),
          phoneNumber,
        },
      ],
    },
  });

  if (userExists.length > 0) {
    return res.status(400).json({ error: "User already exists" });
  }

  // Hash the PIN
  const hashedPassword = bcrypt.hashSync(pin, 10);

  const JWT_SECRET = process.env.JWT_SECRET;

  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not configured");
  }

  try {
    const user = await prisma.member.create({
      data: {
        memberId: Number(memberId),
        fullName,
        fatherName,
        address,
        phoneNumber,
        alternateNumber,
        dateOfBirth,
        shareAmount: Number(shareAmount),
        loanAmount: Number(loanAmount),
        membershipFees: Number(membershipFees),
        role: "USER",
        pin: hashedPassword,
      },
    });

    res.json({ user });
  } catch (error) {
    res.status(400).json({ error });
  }
});

app.post("/user/login", async (req, res) => {
  const { phoneNumber } = req.body;
  const userPin = req.body.pin;

  if (!phoneNumber || !userPin) {
    return res.status(400).json({ error: "Phone number and PIN are required" });
  }

  if (phoneNumber.length !== 10) {
    return res.status(400).json({ error: "Please enter correct phone number" });
  }

  if (userPin.length !== 4) {
    return res.status(400).json({ error: "PIN must be 4 digits" });
  }

  const userData = await prisma.member.findFirst({
    where: {
      phoneNumber,
    },
  });

  if (!userData) {
    return res.status(400).json({ error: "User not found" });
  }

  const isPinValid = bcrypt.compareSync(userPin, userData.pin as string);

  if (!isPinValid) {
    return res.status(400).json({ error: "Invalid PIN" });
  }

  const { pin, ...payload } = userData;

  // Generate JWT token
  const JWT_SECRET = process.env.JWT_SECRET;

  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not configured");
  }

  const token = jwt.sign({ memberId: payload.memberId }, JWT_SECRET, {
    expiresIn: "1h",
  });

  res.json({ token, user: payload });
});

app.get("/users", authMiddleware, async (req, res) => {
  const usersData = await prisma.member.findMany();
  const users = usersData.map((data) => {
    const { pin, ...user } = data;
    return user;
  });
  return res.status(200).json({ users });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});
