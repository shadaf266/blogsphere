import mongoose from "mongoose";
import Blog from "../models/Blog.js";
import Like from "../models/Like.js";
import asyncHandler from "../utils/asyncHandler.js";

const findPublishedBlog = async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400);
    throw new Error("Invalid blog ID");
  }
  const blog = await Blog.findById(req.params.id);
  if (!blog || blog.status !== "published") {
    res.status(404);
    throw new Error("Blog not found");
  }
  return blog;
};

const syncCount = async (blogId) => {
  const likesCount = await Like.countDocuments({ blog: blogId });
  await Blog.updateOne({ _id: blogId }, { likesCount });
  return likesCount;
};

// POST /api/v1/blogs/:id/like
export const likeBlog = asyncHandler(async (req, res) => {
  const blog = await findPublishedBlog(req, res);
  try {
    await Like.create({ blog: blog._id, user: req.user._id });
  } catch (err) {
    if (err.code !== 11000) throw err;
  }
  const likesCount = await syncCount(blog._id);
  res.json({ success: true, message: "Liked", data: { liked: true, likesCount } });
});

// DELETE /api/v1/blogs/:id/like
export const unlikeBlog = asyncHandler(async (req, res) => {
  const blog = await findPublishedBlog(req, res);
  await Like.deleteOne({ blog: blog._id, user: req.user._id });
  const likesCount = await syncCount(blog._id);
  res.json({ success: true, message: "Like removed", data: { liked: false, likesCount } });
});

// GET /api/v1/blogs/:id/like-status
export const getLikeStatus = asyncHandler(async (req, res) => {
  const blog = await findPublishedBlog(req, res);
  const liked = Boolean(await Like.exists({ blog: blog._id, user: req.user._id }));
  res.json({ success: true, message: "Like status", data: { liked, likesCount: blog.likesCount } });
});