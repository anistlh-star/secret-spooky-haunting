// backend/server.js
import express from "express";
import path from "path";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose"; // ADD THIS IMPORT
import connectDB from "./config/db.js";
import blogRoutes from "./routes/postRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import { fileURLToPath } from "url";

// Load environment variables FIRST
dotenv.config();

// Debug environment variables
console.log("Environment check:");
console.log("NODE_ENV:", process.env.NODE_ENV);
console.log("MONGODB_URI:", process.env.MONGODB_URI ? "Present" : "Missing");
console.log("PORT:", process.env.PORT);

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// CORS configuration
const allowedOrigins = [
  "https://mern-blog123.netlify.app",
  "https://secret-spooky-haunting-g4vw7pwp7w6w3995j-5173.app.github.dev",
  process.env.CLIENT_URL,
  "http://localhost:5173",
].filter(Boolean);

app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Handle pre-flight for all routes

app.use(express.json());

// Initialize database
connectDB();

// Routes
app.use("/api/blogs", blogRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api/admin", adminRoutes);

// Health check
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    database:
      mongoose.connection.readyState === 1 ? "Connected" : "Disconnected",
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
