import express from "express";
import {
  getUsers,
  getUserById,
  updateProfile,
  changePassword,
  deleteAccount,
} from "../controllers/userController.js";
import upload from "../middleware/uploadMiddleware.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getUsers);
router.get("/:id", getUserById);
router.put("/profile", protect, upload.single("avatar"), updateProfile);
router.put("/change-password", protect, changePassword);
router.delete("/account", protect, deleteAccount);

export default router;
