import mongoose from "mongoose";

// One shared connection. The URI comes from the environment so local and
// hosted databases can be swapped without code changes.
export async function connectDB() {
  const uri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/resume_analyzer";
  mongoose.set("strictQuery", true);
  await mongoose.connect(uri);
  console.log(`MongoDB connected → ${mongoose.connection.name}`);
}
