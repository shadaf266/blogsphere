import express from "express";
import { getBlogs, getBlogBySlug, getBlogById } from "../controllers/blogController.js";

const router = express.Router();

router.get("/", getBlogs);
router.get("/slug/:slug", getBlogBySlug);
router.get("/:id", getBlogById);

export default router;