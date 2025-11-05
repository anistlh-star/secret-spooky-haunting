//mern-blog/backend/server.js
import express from "express";
import path from "path";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import blogRoutes from "./routes/postRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from './routes/userRoutes.js'
import adminRoutes from './routes/adminRoutes.js'
import { fileURLToPath } from "url";


const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
app.use(
  cors({
    origin: "https://secret-spooky-haunting-g4vw7pwp7w6w3995j-5173.app.github.dev",
    methods: ["GET", "POST", "PUT", "DELETE"],

    credentials: true,
  })
);
app.use(express.json());

connectDB();

//now importing all routes here
app.use("/api/blogs", blogRoutes);
//now importing auth routes here
app.use("/api/auth", authRoutes);
//now importing User routes here

app.use("/api/user", userRoutes);

//make the uploads folder publically available
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use('/api/admin', adminRoutes)



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
