import "dotenv/config";
import path from "path";
import { fileURLToPath } from "url";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import mongoose from "mongoose";
import connectDB from "./config/db.js";
import blogRoutes from "./routes/blogRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import { notFound, errorHandler } from "./middleware/errorHandler.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import likeRoutes from "./routes/likeRoutes.js";
import bookmarkRoutes from "./routes/bookmarkRoutes.js";
import commentRoutes, { blogCommentRouter } from "./routes/commentRoutes.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
if (process.env.NODE_ENV !== "production") app.use(morgan("dev"));

app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));
app.use("/api/v1/categories", categoryRoutes);

app.get("/api/v1/health", (req, res) => {
  res.json({
    success: true,
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
  });
});

app.use("/api/v1/blogs", blogRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/blogs", likeRoutes);
app.use("/api/v1/bookmarks", bookmarkRoutes);
app.use("/api/v1/blogs", blogCommentRouter);
app.use("/api/v1/comments", commentRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
});