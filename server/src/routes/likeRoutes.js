import express from "express";
import { likeBlog, unlikeBlog, getLikeStatus } from "../controllers/likeController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/:id/like", protect, likeBlog);
router.delete("/:id/like", protect, unlikeBlog);
router.get("/:id/like-status", protect, getLikeStatus);

export default router;