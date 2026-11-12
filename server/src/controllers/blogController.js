import mongoose from "mongoose";
import Blog from "../models/Blog.js";
import Category from "../models/Category.js";
import asyncHandler from "../utils/asyncHandler.js";

const populateBlog = (query) =>
  query
    .populate("author", "name avatar bio")
    .populate("category", "name slug");

// GET /api/v1/blogs
export const getBlogs = asyncHandler(async (req, res) => {
  const page = Math.max(parseInt(req.query.page) || 1, 1);
  const limit = Math.min(parseInt(req.query.limit) || 9, 50);

  const filter = { status: "published" };

  if (req.query.search) {
    const regex = new RegExp(req.query.search.trim(), "i");
    filter.$or = [{ title: regex }, { content: regex }];
  }
  if (req.query.category) {
    const cat = await Category.findOne({ slug: req.query.category });
    filter.category = cat ? cat._id : null;
  }
  if (req.query.tag) filter.tags = req.query.tag;
  if (req.query.author && mongoose.Types.ObjectId.isValid(req.query.author)) {
    filter.author = req.query.author;
  }
  if (req.query.featured === "true") filter.isFeatured = true;

  const sorts = { newest: "-createdAt", oldest: "createdAt", popular: "-likesCount -viewsCount" };
  const sort = sorts[req.query.sort] || sorts.newest;

  const total = await Blog.countDocuments(filter);
  const blogs = await populateBlog(
    Blog.find(filter).sort(sort).skip((page - 1) * limit).limit(limit)
  );

  res.json({
    success: true,
    message: "Blogs retrieved successfully",
    data: blogs,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      hasPrev: page > 1,
      hasNext: page * limit < total,
    },
  });
});

// GET /api/v1/blogs/slug/:slug
export const getBlogBySlug = asyncHandler(async (req, res) => {
  const blog = await populateBlog(
    Blog.findOne({ slug: req.params.slug, status: "published" })
  );
  if (!blog) {
    res.status(404);
    throw new Error("Blog not found");
  }
  res.json({ success: true, message: "Blog retrieved successfully", data: blog });
});

// GET /api/v1/blogs/:id
export const getBlogById = asyncHandler(async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400);
    throw new Error("Invalid blog ID");
  }
  const blog = await populateBlog(Blog.findById(req.params.id));
  if (!blog || blog.status !== "published") {
    res.status(404);
    throw new Error("Blog not found");
  }
  res.json({ success: true, message: "Blog retrieved successfully", data: blog });
});