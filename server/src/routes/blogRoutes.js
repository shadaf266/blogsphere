import express from "express";
import {
  getBlogs,
  getBlogBySlug,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
  publishBlog,
  unpublishBlog,
  getMyBlogs,
  getMyStats,
} from "../controllers/blogController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getBlogs);
router.get("/my/all", protect, getMyBlogs);
router.get("/my/stats", protect, getMyStats);
router.get("/slug/:slug", getBlogBySlug);
router.post("/", protect, createBlog);
router.get("/:id", getBlogById);
router.put("/:id", protect, updateBlog);
router.delete("/:id", protect, deleteBlog);
router.patch("/:id/publish", protect, publishBlog);
router.patch("/:id/unpublish", protect, unpublishBlog);

export default router;