import mongoose from "mongoose";
import Category from "../models/Category.js";
import Blog from "../models/Blog.js";
import asyncHandler from "../utils/asyncHandler.js";
import slugify from "../utils/slugify.js";

// GET /api/v1/categories (public, with blog counts)
export const getCategories = asyncHandler(async (req, res) => {
  const [categories, counts] = await Promise.all([
    Category.find().sort("name").lean(),
    Blog.aggregate([
      { $match: { status: "published" } },
      { $group: { _id: "$category", count: { $sum: 1 } } },
    ]),
  ]);
  const countById = Object.fromEntries(counts.map((c) => [String(c._id), c.count]));
  const data = categories.map((c) => ({ ...c, blogCount: countById[String(c._id)] || 0 }));
  res.json({ success: true, message: "Categories retrieved", data });
});

// POST /api/v1/categories (admin)
export const createCategory = asyncHandler(async (req, res) => {
  const { name, description, icon } = req.body;
  if (!name || !name.trim()) {
    res.status(400);
    throw new Error("Category name is required");
  }
  if (await Category.findOne({ name: name.trim() })) {
    res.status(409);
    throw new Error("A category with this name already exists");
  }
  const category = await Category.create({
    name: name.trim(),
    slug: slugify(name),
    description: description || "",
    icon: icon || "",
  });
  res.status(201).json({ success: true, message: "Category created", data: category });
});

// PUT /api/v1/categories/:id (admin)
export const updateCategory = asyncHandler(async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400);
    throw new Error("Invalid category ID");
  }
  const category = await Category.findById(req.params.id);
  if (!category) {
    res.status(404);
    throw new Error("Category not found");
  }
  const { name, description, icon } = req.body;
  if (name && name.trim() !== category.name) {
    if (await Category.findOne({ name: name.trim(), _id: { $ne: category._id } })) {
      res.status(409);
      throw new Error("A category with this name already exists");
    }
    category.name = name.trim();
    category.slug = slugify(name);
  }
  if (description !== undefined) category.description = description;
  if (icon !== undefined) category.icon = icon;
  await category.save();
  res.json({ success: true, message: "Category updated", data: category });
});

// DELETE /api/v1/categories/:id (admin, blocked if blogs use it)
export const deleteCategory = asyncHandler(async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400);
    throw new Error("Invalid category ID");
  }
  const category = await Category.findById(req.params.id);
  if (!category) {
    res.status(404);
    throw new Error("Category not found");
  }
  const used = await Blog.countDocuments({ category: category._id });
  if (used > 0) {
    res.status(409);
    throw new Error(`Cannot delete: ${used} article${used === 1 ? "" : "s"} use this category`);
  }
  await category.deleteOne();
  res.json({ success: true, message: "Category deleted", data: null });
});