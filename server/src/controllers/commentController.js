import mongoose from "mongoose";
import Blog from "../models/Blog.js";
import Comment from "../models/Comment.js";
import asyncHandler from "../utils/asyncHandler.js";

const checkId = (id, res, label) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400);
    throw new Error(`Invalid ${label} ID`);
  }
};

// GET /api/v1/blogs/:id/comments
export const getComments = asyncHandler(async (req, res) => {
  checkId(req.params.id, res, "blog");
  const comments = await Comment.find({ blog: req.params.id })
    .sort("-createdAt")
    .populate("author", "name avatar");
  res.json({ success: true, message: "Comments retrieved", data: comments });
});

// POST /api/v1/blogs/:id/comments
export const addComment = asyncHandler(async (req, res) => {
  checkId(req.params.id, res, "blog");
  const blog = await Blog.findById(req.params.id);
  if (!blog || blog.status !== "published") {
    res.status(404);
    throw new Error("Blog not found");
  }
  const comment = await Comment.create({
    blog: blog._id,
    author: req.user._id,
    content: req.body.content,
  });
  await comment.populate("author", "name avatar");
  res.status(201).json({ success: true, message: "Comment added", data: comment });
});

// PATCH /api/v1/comments/:id
export const updateComment = asyncHandler(async (req, res) => {
  checkId(req.params.id, res, "comment");
  const comment = await Comment.findById(req.params.id);
  if (!comment) {
    res.status(404);
    throw new Error("Comment not found");
  }
  if (comment.author.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Forbidden: you can only edit your own comments");
  }
  comment.content = req.body.content;
  comment.isEdited = true;
  await comment.save();
  await comment.populate("author", "name avatar");
  res.json({ success: true, message: "Comment updated", data: comment });
});

// DELETE /api/v1/comments/:id
export const deleteComment = asyncHandler(async (req, res) => {
  checkId(req.params.id, res, "comment");
  const comment = await Comment.findById(req.params.id);
  if (!comment) {
    res.status(404);
    throw new Error("Comment not found");
  }
  const isOwner = comment.author.toString() === req.user._id.toString();
  if (!isOwner && req.user.role !== "admin") {
    res.status(403);
    throw new Error("Forbidden: you cannot delete this comment");
  }
  await comment.deleteOne();
  res.json({ success: true, message: "Comment deleted", data: null });
});

// GET /api/v1/comments/my
export const getMyComments = asyncHandler(async (req, res) => {
  const comments = await Comment.find({ author: req.user._id })
    .sort("-createdAt")
    .populate("blog", "title slug");
  res.json({ success: true, message: "Your comments", data: comments });
});