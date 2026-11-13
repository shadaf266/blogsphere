import mongoose from "mongoose";
import Blog from "../models/Blog.js";
import Bookmark from "../models/Bookmark.js";
import asyncHandler from "../utils/asyncHandler.js";

const checkId = (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.blogId)) {
    res.status(400);
    throw new Error("Invalid blog ID");
  }
};

// GET /api/v1/bookmarks
export const getBookmarks = asyncHandler(async (req, res) => {
  const bookmarks = await Bookmark.find({ user: req.user._id })
    .sort("-createdAt")
    .populate({
      path: "blog",
      populate: [
        { path: "author", select: "name avatar bio" },
        { path: "category", select: "name slug" },
      ],
    });
  const blogs = bookmarks.map((b) => b.blog).filter((b) => b && b.status === "published");
  res.json({ success: true, message: "Your reading list", data: blogs });
});

// POST /api/v1/bookmarks/:blogId
export const addBookmark = asyncHandler(async (req, res) => {
  checkId(req, res);
  const blog = await Blog.findById(req.params.blogId);
  if (!blog || blog.status !== "published") {
    res.status(404);
    throw new Error("Blog not found");
  }
  try {
    await Bookmark.create({ blog: blog._id, user: req.user._id });
  } catch (err) {
    if (err.code !== 11000) throw err;
  }
  res.status(201).json({ success: true, message: "Bookmarked", data: { bookmarked: true } });
});

// DELETE /api/v1/bookmarks/:blogId
export const removeBookmark = asyncHandler(async (req, res) => {
  checkId(req, res);
  await Bookmark.deleteOne({ blog: req.params.blogId, user: req.user._id });
  res.json({ success: true, message: "Bookmark removed", data: { bookmarked: false } });
});

// GET /api/v1/bookmarks/check/:blogId
export const checkBookmark = asyncHandler(async (req, res) => {
  checkId(req, res);
  const bookmarked = Boolean(await Bookmark.exists({ blog: req.params.blogId, user: req.user._id }));
  res.json({ success: true, message: "Bookmark status", data: { bookmarked } });
});