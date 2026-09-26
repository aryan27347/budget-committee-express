import { Router } from "express";
import authMiddleware from "../middlewares/auth.middleware";
import { MemberController } from "../controllers/member.controller";

const router = Router();
const memberController = new MemberController();

// All
router.get("/all", authMiddleware, memberController.getAllMembers);

router.get("/:id", authMiddleware, memberController.getMember);

// Member can login using phone number and pin
router.post("/login", memberController.login);

// Only Authorized Member can add new Member
router.post("/register", authMiddleware, memberController.registerMember);

// Only Authorized Member can update profile
router.put("/update", authMiddleware, memberController.updateMember);

router.delete("/delete/:id", authMiddleware, memberController.deleteMember);

export default router;
