import express, { Application } from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import mongoose from "mongoose";
import actionsRouter from "./routes/actions";
import notificationsRouter from "./routes/notifications";
import { clerkMiddleware} from '@clerk/express'



dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI as string;

app.use(cors({
  origin: process.env.ALLOWED_ORIGIN,
  credentials: true,
}));

app.set("trust proxy", true); // for Clerk cookies via Vercel
app.use(clerkMiddleware())
app.use(express.json());


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
app.use("/api/actions", actionsRouter);
app.use("/api/notifications", notificationsRouter);

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));