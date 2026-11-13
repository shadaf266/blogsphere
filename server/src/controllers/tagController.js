import Blog from "../models/Blog.js";
import asyncHandler from "../utils/asyncHandler.js";

export const getPopularTags = asyncHandler(async (req, res) => {
  const tags = await Blog.aggregate([
    { $match: { status: "published" } },
    { $unwind: "$tags" },
    { $group: { _id: "$tags", count: { $sum: 1 } } },
    { $sort: { count: -1, _id: 1 } },
    { $limit: 15 },
    { $project: { _id: 0, name: "$_id", count: 1 } },
  ]);
  res.json({ success: true, message: "Popular tags", data: tags });
});