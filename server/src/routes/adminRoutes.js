import express from "express";
import {
  getStats,
  getUsers,
  setUserRole,
  setUserStatus,
  getAdminBlogs,
  toggleFeature,
  adminDeleteBlog,
} from "../controllers/adminController.js";
import { getInquiries, setInquiryStatus } from "../controllers/inquiryController.js";
import { protect } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.use(protect, adminOnly);

router.get("/stats", getStats);
router.get("/users", getUsers);
router.patch("/users/:id/role", setUserRole);
router.patch("/users/:id/status", setUserStatus);
router.get("/blogs", getAdminBlogs);
router.patch("/blogs/:id/feature", toggleFeature);
router.delete("/blogs/:id", adminDeleteBlog);
router.get("/inquiries", getInquiries);
router.patch("/inquiries/:id/status", setInquiryStatus);

export default router;