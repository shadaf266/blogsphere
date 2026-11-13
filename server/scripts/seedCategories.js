import "dotenv/config";
import mongoose from "mongoose";
import Category from "../src/models/Category.js";
import slugify from "../src/utils/slugify.js";

const names = ["Programming", "Design", "Technology", "Career", "Productivity"];

await mongoose.connect(process.env.MONGO_URI);

for (const name of names) {
  const exists = await Category.findOne({ name });
  if (!exists) {
    await Category.create({ name, slug: slugify(name) });
    console.log(`Added ${name}`);
  }
}

console.log("Categories ready.");
await mongoose.disconnect();