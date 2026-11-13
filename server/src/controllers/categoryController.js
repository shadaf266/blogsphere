import Category from "../models/Category.js";
import asyncHandler from "../utils/asyncHandler.js";

export const getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find().sort("name");
  res.json({ success: true, message: "Categories retrieved", data: categories });
});