import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      unique: true,
      trim: true,
      maxlength: [40, "Name cannot exceed 40 characters"],
    },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String, maxlength: [200, "Description cannot exceed 200 characters"], default: "" },
    icon: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.model("Category", categorySchema);