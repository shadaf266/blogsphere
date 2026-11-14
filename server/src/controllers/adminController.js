import mongoose from "mongoose";
import User from "../models/User.js";
import Blog from "../models/Blog.js";
import Comment from "../models/Comment.js";
import Like from "../models/Like.js";
import Bookmark from "../models/Bookmark.js";
import ContactMessage from "../models/ContactMessage.js";
import asyncHandler from "../utils/asyncHandler.js";

const checkId = (id, res) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400);
    throw new Error("Invalid ID");
  }
};

// GET /api/v1/admin/stats
export const getStats = asyncHandler(async (req, res) => {
  const [users, published, drafts, comments, inquiries, views, recentUsers, recentBlogs] =
    await Promise.all([
      User.countDocuments(),
      Blog.countDocuments({ status: "published" }),
      Blog.countDocuments({ status: "draft" }),
      Comment.countDocuments(),
      ContactMessage.countDocuments({ status: "new" }),
      Blog.aggregate([{ $group: { _id: null, total: { $sum: "$viewsCount" } } }]),
      User.find().sort("-createdAt").limit(5).select("name email role createdAt"),
      Blog.find().sort("-createdAt").limit(5).populate("author", "name").select("title status author createdAt"),
    ]);

  res.json({
    success: true,
    message: "Platform statistics",
    data: {
      users,
      published,
      drafts,
      comments,
      inquiries,
      views: views[0]?.total || 0,
      recentUsers,
      recentBlogs,
    },
  });
});

// GET /api/v1/admin/users
export const getUsers = asyncHandler(async (req, res) => {
  const page = Math.max(parseInt(req.query.page) || 1, 1);
  const limit = Math.min(parseInt(req.query.limit) || 20, 50);
  const filter = {};
  if (req.query.search) {
    const escaped = req.query.search.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(escaped, "i");
    filter.$or = [{ name: regex }, { email: regex }];
  }
  const total = await User.countDocuments(filter);
  const users = await User.find(filter).sort("-createdAt").skip((page - 1) * limit).limit(limit);
  res.json({
    success: true,
    message: "Users retrieved",
    data: users,
    meta: { total, page, limit, totalPages: Math.ceil(total / limit), hasPrev: page > 1, hasNext: page * limit < total },
  });
});

// PATCH /api/v1/admin/users/:id/role
export const setUserRole = asyncHandler(async (req, res) => {
  checkId(req.params.id, res);
  const { role } = req.body;
  if (!["user", "admin"].includes(role)) {
    res.status(400);
    throw new Error("Role must be user or admin");
  }
  if (req.params.id === req.user._id.toString()) {
    res.status(400);
    throw new Error("You cannot change your own role");
  }
  const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true });
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }
  res.json({ success: true, message: "Role updated", data: user });
});

// PATCH /api/v1/admin/users/:id/status
export const setUserStatus = asyncHandler(async (req, res) => {
  checkId(req.params.id, res);
  if (typeof req.body.isSuspended !== "boolean") {
    res.status(400);
    throw new Error("isSuspended must be true or false");
  }
  if (req.params.id === req.user._id.toString()) {
    res.status(400);
    throw new Error("You cannot suspend your own account");
  }
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { isSuspended: req.body.isSuspended },
    { new: true }
  );
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }
  res.json({ success: true, message: user.isSuspended ? "User suspended" : "User reactivated", data: user });
});

// GET /api/v1/admin/blogs
export const getAdminBlogs = asyncHandler(async (req, res) => {
  const filter = {};
  if (["draft", "published"].includes(req.query.status)) filter.status = req.query.status;
  if (req.query.search) {
    const escaped = req.query.search.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    filter.title = new RegExp(escaped, "i");
  }
  const blogs = await Blog.find(filter)
    .sort("-createdAt")
    .limit(100)
    .populate("author", "name email")
    .populate("category", "name");
  res.json({ success: true, message: "All blogs", data: blogs });
});

// PATCH /api/v1/admin/blogs/:id/feature
export const toggleFeature = asyncHandler(async (req, res) => {
  checkId(req.params.id, res);
  const blog = await Blog.findById(req.params.id);
  if (!blog) {
    res.status(404);
    throw new Error("Blog not found");
  }
  blog.isFeatured = !blog.isFeatured;
  await blog.save();
  res.json({ success: true, message: blog.isFeatured ? "Blog featured" : "Blog unfeatured", data: blog });
});

// DELETE /api/v1/admin/blogs/:id
export const adminDeleteBlog = asyncHandler(async (req, res) => {
  checkId(req.params.id, res);
  const blog = await Blog.findById(req.params.id);
  if (!blog) {
    res.status(404);
    throw new Error("Blog not found");
  }
  await Promise.all([
    Comment.deleteMany({ blog: blog._id }),
    Like.deleteMany({ blog: blog._id }),
    Bookmark.deleteMany({ blog: blog._id }),
  ]);
  await blog.deleteOne();
  res.json({ success: true, message: "Blog deleted by admin", data: null });
});