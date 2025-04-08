import express, { Application } from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import mongoose from "mongoose";
import actionRouter from "./routes/action";
import { clerkMiddleware } from '@clerk/express'


dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI as string;

app.use(clerkMiddleware())
app.use(express.json());
app.use(cors({
  origin: process.env.ALLOWED_ORIGIN,
  credentials: true,
}));

// Connect to MongoDB
const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB Connected");
  } catch (error) {
    console.error("MongoDB Connection Error:", error);
    process.exit(1);
  }
};

connectDB();

// Routes
app.use("/api/actions", actionRouter);

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));