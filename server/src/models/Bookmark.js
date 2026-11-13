import mongoose from "mongoose";

const bookmarkSchema = new mongoose.Schema({
  blog: { type: mongoose.Schema.Types.ObjectId, ref: "Blog", required: true, index: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  createdAt: { type: Date, default: Date.now },
});

bookmarkSchema.index({ blog: 1, user: 1 }, { unique: true });

export default mongoose.model("Bookmark", bookmarkSchema);