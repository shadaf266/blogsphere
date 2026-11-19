
import "dotenv/config";
import path from "path";
import { fileURLToPath } from "url";
import dns from "node:dns";

import express from "express";
import cors from "cors";
import morgan from "morgan";
import mongoose from "mongoose";

import connectDB from "./config/db.js";

// Routes
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
import userRoutes from "./routes/userRoutes.js";

// Middleware
import {
    notFound,
    errorHandler
} from "./middleware/errorHandler.js";

// DNS configuration
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

// ======================================
// CORS CONFIGURATION
// ======================================

const allowedOrigins = [
    "http://localhost:5173",
    "https://blogsphere-three-xi.vercel.app"
];

app.use(cors({
    origin: allowedOrigins,
    credentials: true
}));

// ======================================
// GENERAL MIDDLEWARE
// ======================================

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== "production") {
    app.use(morgan("dev"));
}

// ======================================
// STATIC FILES
// ======================================

app.use(
    "/uploads",
    express.static(path.join(__dirname, "..", "uploads"))
);

// ======================================
// ROOT ROUTE
// ======================================

app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "BlogSphere API is running 🚀"
    });
});

// ======================================
// HEALTH CHECK
// ======================================

app.get("/api/v1/health", (req, res) => {
    res.status(200).json({
        success: true,
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
        database:
            mongoose.connection.readyState === 1
                ? "connected"
                : "disconnected"
    });
});

// ======================================
// API ROUTES
// ======================================

const API = "/api/v1";

app.use(`${API}/users`, userRoutes);
app.use(`${API}/auth`, authRoutes);

app.use(`${API}/blogs`, blogRoutes);
app.use(`${API}/blogs`, likeRoutes);
app.use(`${API}/blogs`, blogCommentRouter);

app.use(`${API}/categories`, categoryRoutes);
app.use(`${API}/tags`, tagRoutes);

app.use(`${API}/bookmarks`, bookmarkRoutes);
app.use(`${API}/comments`, commentRoutes);

app.use(`${API}/admin`, adminRoutes);
app.use(`${API}/inquiries`, inquiryRoutes);

// ======================================
// ERROR HANDLING
// ======================================

app.use(notFound);
app.use(errorHandler);

// ======================================
// SERVER START
// ======================================

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        await connectDB();

        app.listen(PORT, () => {
            console.log("----------------------------------");
            console.log("BlogSphere API Started");
            console.log(`Server: http://localhost:${PORT}`);
            console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
            console.log("Database: Connected");
            console.log("----------------------------------");
        });
    } catch (error) {
        console.error("Failed to start server:", error.message);
        process.exit(1);
    }
};

if (process.env.NODE_ENV !== "production") {
    startServer();
}

export default app;
