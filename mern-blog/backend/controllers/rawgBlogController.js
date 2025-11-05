import axios from "axios";
import Blog from "../models/Blog.js";

const RAWGKEY = process.env.RAWG_API_KEY; // from rawg.io

// 🔹 Get gaming blogs from RAWG API
export const handleGameBlogs = async (req, res) => {
  try {
    const { search = "zelda" } = req.query; // optional search query
    const { data } = await axios.get(
      `https://api.rawg.io/api/games?key=${RAWGKEY}&search=${search}`
    );

    const gameBlogs = data.results.map((game) => ({
      id: game.id,
      title: game.name,
      description: `Released: ${game.released}`,
      rating: game.rating,
      image: game.background_image,
      source: "RAWG",
    }));

    res.json(gameBlogs);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch from RAWG", error: err.message });
  }
};
