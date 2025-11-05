// seedBlogs.js
import mongoose from "mongoose";
import Blog from "./models/Blog.js";
import User from "./models/User.js";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Fix for ES modules __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env vars from the correct path
dotenv.config({ path: path.join(__dirname, '.env') });

const seedBlogs = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || "mongodb://localhost:27017/your-database-name";
    
    console.log("🔗 Connecting to MongoDB...");
    await mongoose.connect(mongoURI);
    console.log("✅ Connected to MongoDB");

    // Clear existing data
    await Blog.deleteMany({});
    await User.deleteMany({});
    console.log("🗑️ Cleared existing blogs and users");

    // Create multiple users with different names
    const users = [
      {
        name: "Alex Chen",
        email: "alex@blogapp.com",
        password: await bcrypt.hash("password123", 12)
      },
      {
        name: "Sakura Tanaka",
        email: "sakura@blogapp.com", 
        password: await bcrypt.hash("password123", 12)
      },
      {
        name: "Marcus Rivers",
        email: "marcus@blogapp.com",
        password: await bcrypt.hash("password123", 12)
      },
      {
        name: "Luna Park",
        email: "luna@blogapp.com",
        password: await bcrypt.hash("password123", 12)
      }
    ];

    const createdUsers = await User.insertMany(users);
    console.log(`👥 Created ${createdUsers.length} users`);

    // Create blogs with different authors
    const blogs = [
      // Alex Chen's blogs (Gaming focus)
      {
        title: "Anime Games That Actually Don't Suck",
        content: "Dragon Ball FighterZ, Persona 5, and Naruto Ultimate Ninja Storm series prove that anime games can be amazing when done right. The cel-shaded graphics and faithful adaptations make them stand out.",
        category: "Gaming",
        author: createdUsers[0]._id,
        authorName: createdUsers[0].name,
        likes: 28,
      },
      {
        title: "Genshin Impact's Anime Inspiration",
        content: "From the art style reminiscent of Studio Ghibli to character designs that feel straight out of an isekai anime, Genshin Impact perfectly blends gaming with anime aesthetics that appeal to both communities.",
        category: "Gaming",
        author: createdUsers[0]._id,
        authorName: createdUsers[0].name,
        likes: 32,
      },
      {
        title: "Best Fighting Games for Anime Fans",
        content: "Guilty Gear Strive, BlazBlue, and Under Night In-Birth offer the fast-paced, over-the-top action that anime fans crave. The combo systems feel like watching an epic anime battle scene!",
        category: "Gaming",
        author: createdUsers[0]._id,
        authorName: createdUsers[0].name,
        likes: 24,
      },

      // Sakura Tanaka's blogs (Anime focus)
      {
        title: "Anime That Feel Like Video Games",
        content: "Sword Art Online, Log Horizon, and .hack// series literally take place in games, while shows like One Punch Man and My Hero Academia have power systems that feel like RPG leveling.",
        category: "Anime",
        author: createdUsers[1]._id,
        authorName: createdUsers[1].name,
        likes: 35,
      },
      {
        title: "Anime Characters Who Would Be OP Gamers",
        content: "Light Yagami's strategic mind in Death Note, Lelouch's genius in Code Geass, and Sora and Shiro's unbeatable teamwork in No Game No Life - these characters were born for competitive gaming.",
        category: "Anime",
        author: createdUsers[1]._id,
        authorName: createdUsers[1].name,
        likes: 31,
      },
      {
        title: "Anime That Perfectly Adapt Games",
        content: "The Cyberpunk: Edgerunners anime proved that game adaptations can be incredible when given to the right studio. Castlevania and Arcane show how to expand game worlds beautifully.",
        category: "Anime",
        author: createdUsers[1]._id,
        authorName: createdUsers[1].name,
        likes: 42,
      },

      // Marcus Rivers' blogs (Mixed content)
      {
        title: "Gaming Soundtracks That Rival Anime OPs",
        content: "Persona 5's jazz fusion, NieR: Automata's haunting melodies, and Final Fantasy's orchestral masterpieces compete with the best anime openings for musical excellence and emotional impact.",
        category: "Gaming",
        author: createdUsers[2]._id,
        authorName: createdUsers[2].name,
        likes: 27,
      },
      {
        title: "Games With Better Stories Than Most Anime",
        content: "The Last of Us, Red Dead Redemption 2, and Life is Strange deliver emotional narratives and character development that could easily be award-winning anime series.",
        category: "Gaming",
        author: createdUsers[2]._id,
        authorName: createdUsers[2].name,
        likes: 29,
      },
      {
        title: "Anime Crossovers We Need in Games",
        content: "Imagine a fighting game with Goku, Luffy, and Naruto together, or an RPG where Attack on Titan characters face Dark Souls bosses. The crossover potential is endless!",
        category: "Anime",
        author: createdUsers[2]._id,
        authorName: createdUsers[2].name,
        likes: 38,
      },

      // Luna Park's blogs (Culture & Analysis)
      {
        title: "Gacha Games: The Modern Card Collection",
        content: "Fate/Grand Order, Arknights, and Honkai Impact 3rd have perfected the gacha system that keeps players hooked, much like how anime fans collect merchandise and figures.",
        category: "Gaming",
        author: createdUsers[3]._id,
        authorName: createdUsers[3].name,
        likes: 23,
      },
      {
        title: "From Manga Panels to Game Screens",
        content: "How games like Dragon Ball Z: Kakarot and JoJo's Bizarre Adventure: All Star Battle R perfectly capture the dynamic art style and poses from their manga origins.",
        category: "Gaming",
        author: createdUsers[3]._id,
        authorName: createdUsers[3].name,
        likes: 26,
      },
      {
        title: "Anime That Teach You Gaming Strategies",
        content: "No Game No Life teaches bluffing and psychological warfare, Kaiji explores gambling tactics, and Log Horizon demonstrates MMORPG raid strategies that actually work in real games.",
        category: "Anime",
        author: createdUsers[3]._id,
        authorName: createdUsers[3].name,
        likes: 33,
      },
      {
        title: "Games That Feel Like Interactive Anime",
        content: "The Persona series, especially Persona 5, blends social sim elements with RPG gameplay in a way that feels like you're living through your own anime season with perfect pacing.",
        category: "Gaming",
        author: createdUsers[3]._id,
        authorName: createdUsers[3].name,
        likes: 37,
      },
      {
        title: "Anime Power Systems as Game Mechanics",
        content: "Nen from Hunter x Hunter, Quirks from My Hero Academia, and Cursed Energy from Jujutsu Kaisen would make incredible RPG skill trees with their complex rules and creative applications.",
        category: "Anime",
        author: createdUsers[3]._id,
        authorName: createdUsers[3].name,
        likes: 30,
      },
      {
        title: "When Gaming Culture Meets Anime Fandom",
        content: "The overlap between anime conventions and gaming tournaments, the shared love for collectibles, and how both communities have shaped modern internet culture and memes.",
        category: "Culture",
        author: createdUsers[3]._id,
        authorName: createdUsers[3].name,
        likes: 25,
      }
    ];

    // Insert blogs
    const result = await Blog.insertMany(blogs);
    console.log(`✅ Seeded ${result.length} blogs with different authors`);

    // Display summary
    console.log("\n📊 SEED SUMMARY:");
    console.log("=================");
    createdUsers.forEach(user => {
      const userBlogs = blogs.filter(blog => blog.author.equals(user._id));
      console.log(`👤 ${user.name} (${user.email}): ${userBlogs.length} blogs`);
    });

    console.log("\n🎉 Database seeded successfully!");
    
  } catch (error) {
    console.error("❌ Error seeding blogs:", error);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Disconnected from MongoDB");
  }
};

seedBlogs();