import express from "express";
import { register, login, getMe, verifyToken } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", protect, getMe);
router.get("/verify-token", protect, verifyToken);

export default router;