import { Request, Response, NextFunction } from "express";

const jwt = require("jsonwebtoken");

function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.token as string;
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Access denied. Token missing." });
  }

  const JWT_SECRET = process.env.JWT_SECRET;

  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not configured");
  }

  jwt.verify(token, JWT_SECRET, (err: any, decodedUser: any) => {
    if (err) {
      return res.status(403).json({ error: "Invalid or expired token." });
    }

    req.headers.user = decodedUser;
    next();
  });
}

export default authMiddleware;
