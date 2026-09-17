import dotenv from "dotenv";
import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import fs from "fs";
import path from "path";
import cors from "cors";
import headersMiddleware from "./middlewares/headers.middleware";
import authMiddleware from "./middlewares/auth.middleware";

dotenv.config();

const app = express();
const filePath = path.join(__dirname, "users.json");

app.use(express.json({ strict: false }));
app.use(cors());
app.use(headersMiddleware);

async function readUsersData() {
  try {
    const data = await fs.promises.readFile(filePath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.log(error);
    return [];
  }
}

async function writeUsersData(data: any) {
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
  if (
    usersData.find(
      (user: any) =>
        user.phoneNumber.toString() === phoneNumber.toString() ||
        user.memberId.toString() === memberId.toString(),
    )
  ) {
    return res.status(400).json({ error: "User already exists" });
  }

  // Hash the PIN
  const hashedPassword = bcrypt.hashSync(pin, 10);

  const JWT_SECRET = process.env.JWT_SECRET;

  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not configured");
  }

  usersData.push({
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
    pin: hashedPassword,
    role: "user",
  });

  writeUsersData(usersData);

  res.json({ user: req.body });
});

app.post("/user/login", async (req, res) => {
  const { phoneNumber, pin } = req.body;

  if (!phoneNumber || !pin) {
    return res.status(400).json({ error: "Phone number and PIN are required" });
  }

  if (phoneNumber.length !== 10) {
    return res.status(400).json({ error: "Please enter correct phone number" });
  }

  if (pin.length !== 4) {
    return res.status(400).json({ error: "PIN must be 4 digits" });
  }

  const usersData = await readUsersData();
  const user = usersData.find((user: any) => user.phoneNumber === phoneNumber);

  if (!user) {
    return res.status(400).json({ error: "User not found" });
  }

  const isPinValid = bcrypt.compareSync(pin, user.pin);

  if (!isPinValid) {
    return res.status(400).json({ error: "Invalid PIN" });
  }

  const payload = { ...user };
  delete payload.pin;

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
  const usersData = await readUsersData();
  const users = usersData.map((data: any) => {
    delete data.pin;
    return data;
  });
  return res.status(200).json({ users });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});
