import express from "express";
import {
  getComments,
  addComment,
  updateComment,
  deleteComment,
  getMyComments,
} from "../controllers/commentController.js";
import { protect } from "../middleware/authMiddleware.js";

export const blogCommentRouter = express.Router();
blogCommentRouter.get("/:id/comments", getComments);
blogCommentRouter.post("/:id/comments", protect, addComment);

const router = express.Router();
router.get("/my", protect, getMyComments);
router.patch("/:id", protect, updateComment);
router.delete("/:id", protect, deleteComment);

export default router;