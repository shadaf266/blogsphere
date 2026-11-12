import "dotenv/config";
import mongoose from "mongoose";
import User from "../src/models/User.js";
import Category from "../src/models/Category.js";
import Blog from "../src/models/Blog.js";
import slugify from "../src/utils/slugify.js";

const body = [
  "Every great project starts with a clear idea and a small first step. In this article we walk through the process from the first line of code to a working result.",
  "The key is to build in small pieces and check each one before moving on. When something breaks, you know exactly where to look.",
  "By the end, you will have a solid understanding of the concept and a working example you can adapt for your own projects.",
].join("\n\n");

const categoryData = [
  { name: "Programming", description: "Code, tools and techniques for developers." },
  { name: "Design", description: "UI, UX and visual design for the web." },
  { name: "Technology", description: "News and ideas from the world of tech." },
  { name: "Career", description: "Growing and succeeding as a developer." },
  { name: "Productivity", description: "Habits and routines for focused work." },
];

const userData = [
  { name: "Asha Verma", email: "asha@blogsphere.com", bio: "Writes about web development, design and building products." },
  { name: "Ravi Menon", email: "ravi@blogsphere.com", bio: "Engineer who loves clean code and simple design." },
  { name: "Neha Kapoor", email: "neha@blogsphere.com", bio: "Writes about careers, learning and technology." },
  { name: "Admin", email: "admin@blogsphere.com", bio: "Platform administrator.", role: "admin" },
];

const blogData = [
  { title: "Building a REST API with Express and MongoDB", excerpt: "A practical walk-through of routes, controllers and models.", category: "Programming", author: "asha@blogsphere.com", tags: ["node", "api", "mongodb"], isFeatured: true },
  { title: "Design Tokens: One Source of Truth for Your CSS", excerpt: "How CSS variables keep colours, spacing and fonts consistent.", category: "Design", author: "ravi@blogsphere.com", tags: ["css", "design"], isFeatured: true },
  { title: "React State Explained Without the Jargon", excerpt: "What useState really does, and why a plain variable cannot update the screen.", category: "Programming", author: "asha@blogsphere.com", tags: ["react", "javascript"], isFeatured: true },
  { title: "How to Prepare for Your First Developer Interview", excerpt: "Practical steps for projects, portfolios and the questions you should expect.", category: "Career", author: "neha@blogsphere.com", tags: ["career", "interview"] },
  { title: "Deep Work: A Simple Routine for Focused Coding", excerpt: "A small daily routine that protects your focus and helps you ship more.", category: "Productivity", author: "ravi@blogsphere.com", tags: ["focus", "habits"] },
  { title: "Why Every Developer Should Learn the Command Line", excerpt: "The shortcuts that save hours, and the commands you will use every day.", category: "Technology", author: "neha@blogsphere.com", tags: ["terminal", "tools"] },
  { title: "Responsive Layouts with CSS Grid in Ten Minutes", excerpt: "Build a layout that adapts from phone to desktop with a few lines of CSS.", category: "Design", author: "asha@blogsphere.com", tags: ["css", "grid"] },
  { title: "JWT Authentication Explained Step by Step", excerpt: "How tokens, hashing and middleware work together to protect your API.", category: "Technology", author: "ravi@blogsphere.com", tags: ["jwt", "security"] },
];

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected. Clearing old data...");

  await Promise.all([Blog.deleteMany(), Category.deleteMany(), User.deleteMany()]);

  const categories = await Category.insertMany(
    categoryData.map((c) => ({ ...c, slug: slugify(c.name) }))
  );
  const categoryByName = Object.fromEntries(categories.map((c) => [c.name, c._id]));

  const users = [];
  for (const u of userData) {
    users.push(await User.create({ ...u, password: "Password@123" }));
  }
  const userByEmail = Object.fromEntries(users.map((u) => [u.email, u._id]));

  for (const [i, b] of blogData.entries()) {
    await Blog.create({
      title: b.title,
      excerpt: b.excerpt,
      content: body,
      coverImage: `https://picsum.photos/seed/blog${i + 1}/600/400`,
      author: userByEmail[b.author],
      category: categoryByName[b.category],
      tags: b.tags,
      status: "published",
      isFeatured: Boolean(b.isFeatured),
    });
  }

  console.log(`Seeded ${categories.length} categories, ${users.length} users, ${blogData.length} blogs.`);
  await mongoose.disconnect();
};

seed().catch((err) => {
  console.error("Seed failed:", err.message);
  process.exit(1);
});