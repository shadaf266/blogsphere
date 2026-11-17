
import "dotenv/config";
import path from "path";
import { fileURLToPath } from "url";
import dns from "node:dns";

import express from "express";
import cors from "cors";
import morgan from "morgan";
import mongoose from "mongoose";

import connectDB from "./config/db.js";

import blogRoutes from "./routes/blogRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import likeRoutes from "./routes/likeRoutes.js";
import bookmarkRoutes from "./routes/bookmarkRoutes.js";
import commentRoutes, {
    blogCommentRouter
} from "./routes/commentRoutes.js";
import tagRoutes from "./routes/tagRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import inquiryRoutes from "./routes/inquiryRoutes.js";

import {
    notFound,
    errorHandler
} from "./middleware/errorHandler.js";

// DNS configuration
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

// Middleware
app.use(
    cors({
        origin: process.env.CLIENT_URL,
        credentials: true
    })
);

app.use(async (req, res, next) => {
    try {
        await connectDB();
        next();
    } catch (error) {
        next(error);
    }
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== "production") {
    app.use(morgan("dev"));
}

// Root route
app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "BlogSphere API is running 🚀"
    });
});

// Static files
app.use(
    "/uploads",
    express.static(path.join(__dirname, "..", "uploads"))
);

// API routes
app.use("/api/v1/categories", categoryRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/inquiries", inquiryRoutes);

app.get("/api/v1/health", (req, res) => {
    res.json({
        success: true,
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
        database:
            mongoose.connection.readyState === 1
                ? "connected"
                : "disconnected"
    });
});

app.use("/api/v1/blogs", blogRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/blogs", likeRoutes);
app.use("/api/v1/bookmarks", bookmarkRoutes);
app.use("/api/v1/blogs", blogCommentRouter);
app.use("/api/v1/comments", commentRoutes);
app.use("/api/v1/tags", tagRoutes);

// Error handling
app.use(notFound);
app.use(errorHandler);


app.use(cors({
    origin: [
        "http://localhost:5173",
        "https://your-actual-frontend.vercel.app"
    ],
    credentials: true
}));

// Local development
const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== "production") {
    connectDB()
        .then(() => {
            app.listen(PORT, () => {
                console.log(
                    `Server running on http://localhost:${PORT}`
                );
            });
        })
        .catch((error) => {
            console.error("Database connection failed:", error);
            process.exit(1);
        });
}



export default app;
