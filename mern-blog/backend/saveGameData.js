import axios from "axios";
import dotenv from "dotenv";
import mongoose from "mongoose";
import Blog from "./models/Blog.js";
import User from "./models/User.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();

const RAWG_API_KEY = process.env.RAWG_API_KEY;
const MONGODB_URI = process.env.MONGODB_URI;

const saveGameData = async () => {
  if (!MONGODB_URI) {
    console.error("❌ Missing MONGODB_URI in .env file");
    process.exit(1);
  }
  if (!RAWG_API_KEY) {
    console.error("❌ Missing RAWG_API_KEY in .env file");
    process.exit(1);
  }

  try {
    console.log("🔗 Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    const user = await User.findOne();
    if (!user) {
      console.error("❌ No user found. Please create a user first.");
      process.exit(1);
    }

    console.log("🎮 Fetching top games from RAWG...");
    const { data } = await axios.get(
      `https://api.rawg.io/api/games?key=${RAWG_API_KEY}&page_size=20`
    );

    const games = data.results;
    let detailedGames = [];

    for (const game of games) {
      console.log(`➡️ Fetching details for ${game.name}...`);
      const detailRes = await axios.get(
        `https://api.rawg.io/api/games/${game.id}?key=${RAWG_API_KEY}`
      );

      const d = detailRes.data;

      detailedGames.push({
        title: d.name,
        content: d.description_raw || "No description available.",
        category: "Game",
        author: user._id,
        authorName: user.name,
        image: d.background_image,
        likes: 0,
        tags: d.genres?.map((g) => g.name) || [],
        status: "published",
        rating: d.rating || 0,
        createdAt: new Date(d.released || Date.now()),
      });

      // Wait 1s between detailed requests to avoid rate limits
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
    await Blog.deleteMany({});
    console.log('✅ previous blogs deleted ')

    await Blog.insertMany(detailedGames);
    console.log(`✅ Saved ${detailedGames.length} detailed games to MongoDB.`);
  } catch (err) {
    console.error("❌ Error saving RAWG data:", err.message);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Disconnected from MongoDB");
    process.exit(0);
  }
};

saveGameData();
