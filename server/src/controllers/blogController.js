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


const canModify = (blog, user) =>
  blog.author.toString() === user._id.toString() || user.role === "admin";

const loadOwnBlog = async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400);
    throw new Error("Invalid blog ID");
  }
  const blog = await Blog.findById(req.params.id);
  if (!blog) {
    res.status(404);
    throw new Error("Blog not found");
  }
  if (!canModify(blog, req.user)) {
    res.status(403);
    throw new Error("Forbidden: you do not own this blog");
  }
  return blog;
};

// POST /api/v1/blogs
export const createBlog = asyncHandler(async (req, res) => {
  const { title, excerpt, content, coverImage, category, tags, status } = req.body;
  const blog = await Blog.create({
    title,
    excerpt,
    content,
    coverImage: coverImage || undefined,
    category,
    tags: Array.isArray(tags) ? tags : [],
    status: status === "published" ? "published" : "draft",
    author: req.user._id,
  });
  res.status(201).json({ success: true, message: "Blog created", data: blog });
});

// PUT /api/v1/blogs/:id
export const updateBlog = asyncHandler(async (req, res) => {
  const blog = await loadOwnBlog(req, res);
  const { title, excerpt, content, coverImage, category, tags, status } = req.body;

  if (title !== undefined) blog.title = title;
  if (excerpt !== undefined) blog.excerpt = excerpt;
  if (content !== undefined) blog.content = content;
  if (coverImage) blog.coverImage = coverImage;
  if (category) blog.category = category;
  if (Array.isArray(tags)) blog.tags = tags;
  if (status === "draft" || status === "published") blog.status = status;

  await blog.save();
  res.json({ success: true, message: "Blog updated", data: blog });
});

// PATCH /api/v1/blogs/:id/publish and /unpublish
const setStatus = (status) =>
  asyncHandler(async (req, res) => {
    const blog = await loadOwnBlog(req, res);
    blog.status = status;
    await blog.save();
    res.json({ success: true, message: `Blog ${status}`, data: blog });
  });

export const publishBlog = setStatus("published");
export const unpublishBlog = setStatus("draft");

// GET /api/v1/blogs/my/all
export const getMyBlogs = asyncHandler(async (req, res) => {
  const blogs = await populateBlog(
    Blog.find({ author: req.user._id }).sort("-createdAt")
  );
  res.json({ success: true, message: "Your blogs", data: blogs });
});

// GET /api/v1/blogs/my/stats
export const getMyStats = asyncHandler(async (req, res) => {
  const blogs = await Blog.find({ author: req.user._id });
  res.json({
    success: true,
    message: "Your stats",
    data: {
      total: blogs.length,
      published: blogs.filter((b) => b.status === "published").length,
      drafts: blogs.filter((b) => b.status === "draft").length,
      views: blogs.reduce((sum, b) => sum + b.viewsCount, 0),
      likes: blogs.reduce((sum, b) => sum + b.likesCount, 0),
    },
  });
});


// DELETE /api/v1/blogs/:id
export const deleteBlog = asyncHandler(async (req, res) => {
  const blog = await loadOwnBlog(req, res);
  await blog.deleteOne();
  res.json({ success: true, message: "Blog deleted", data: null });
});
