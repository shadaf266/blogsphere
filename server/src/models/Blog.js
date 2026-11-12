import mongoose from "mongoose";
import slugify from "../utils/slugify.js";

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      minlength: [5, "Title must be at least 5 characters"],
      maxlength: [150, "Title cannot exceed 150 characters"],
    },
    slug: { type: String, required: true, unique: true, lowercase: true, index: true },
    excerpt: {
      type: String,
      required: [true, "Excerpt is required"],
      maxlength: [250, "Excerpt cannot exceed 250 characters"],
    },
    content: { type: String, required: [true, "Content is required"] },
    coverImage: { type: String, default: "https://picsum.photos/seed/blogsphere/600/400" },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true, index: true },
    tags: { type: [String], default: [], index: true },
    status: { type: String, enum: ["draft", "published"], default: "draft", index: true },
    isFeatured: { type: Boolean, default: false, index: true },
    viewsCount: { type: Number, default: 0 },
    likesCount: { type: Number, default: 0 },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

blogSchema.virtual("readingTime").get(function () {
  const words = this.content ? this.content.split(/\s+/).length : 0;
  return Math.max(1, Math.ceil(words / 200));
});

blogSchema.pre("validate", async function () {
  if (!this.title || (this.slug && !this.isModified("title"))) return;
  const base = slugify(this.title);
  let slug = base;
  let count = 1;
  while (await mongoose.models.Blog.exists({ slug, _id: { $ne: this._id } })) {
    slug = `${base}-${count++}`;
  }
  this.slug = slug;
});

export default mongoose.model("Blog", blogSchema);