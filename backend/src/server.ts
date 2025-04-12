import express, { Application } from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import mongoose from "mongoose";
import actionRouter from "./routes/action";
import { clerkMiddleware, getAuth } from '@clerk/express'



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
app.use("/api/actions", actionRouter);

app.get("/", (req, res) => {
  const auth = getAuth(req);

  if (auth.userId) {
    res.json({
      message: "Session found",
      userId: auth.userId,
      sessionId: auth.sessionId,
      orgId: auth.orgId,
    });
  } else {
    res.json({
      message: "No session found",
    });
  }
});

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));