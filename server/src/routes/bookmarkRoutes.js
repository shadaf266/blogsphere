import express from "express";
import {
  getBookmarks,
  addBookmark,
  removeBookmark,
  checkBookmark,
} from "../controllers/bookmarkController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getBookmarks);
router.get("/check/:blogId", protect, checkBookmark);
router.post("/:blogId", protect, addBookmark);
router.delete("/:blogId", protect, removeBookmark);

export default router;