import axios from "axios";
import dotenv from "dotenv";
import mongoose from "mongoose";
import Blog from "./models/Blog.js";
import User from "./models/User.js";
import path from "path";
import { fileURLToPath } from "url";
dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// dotenv.config({ path: path.join(__dirname, "../.env") });

const MONGODB_URI = process.env.MONGODB_URI;

const saveAnimeData = async () => {
  if (!MONGODB_URI) {
    console.error("❌ Missing MONGODB_URI in .env file");
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

    console.log("🌸 Fetching top anime list from Jikan...");
    const { data } = await axios.get("https://api.jikan.moe/v4/top/anime?limit=20");
    const animes = data.data;
    let detailedAnime = [];

    for (const anime of animes) {
      console.log(`➡️ Fetching details for ${anime.title}...`);
      const detailRes = await axios.get(
        `https://api.jikan.moe/v4/anime/${anime.mal_id}`
      );

      const d = detailRes.data.data;

      detailedAnime.push({
        title: d.title,
        content: d.synopsis
          ? d.synopsis.slice(0, 800)
          : "No description available.",
        category: "Anime",
        author: user._id,
        authorName: user.name,
        image: d.images?.jpg?.image_url || null,
        likes: 0,
        tags: d.genres?.map((g) => g.name) || [],
        status: "published",
        rating: d.score || 0,
        createdAt: new Date(d.aired?.from || Date.now()),
      });

      // Wait 1s to avoid Jikan rate limits (2 req/sec max)
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
//  await Blog.deleteMany({});
    // console.log('✅ previous blogs deleted ')
    await Blog.insertMany(detailedAnime);
    console.log(`✅ Saved ${detailedAnime.length} detailed anime entries to MongoDB.`);
  } catch (err) {
    console.error("❌ Error saving Anime data:", err.message);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Disconnected from MongoDB");
    process.exit(0);
  }
};

saveAnimeData();
