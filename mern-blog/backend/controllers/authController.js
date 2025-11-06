///workspaces/codespaces-blank/mern-blog/backend/controllers/authController.js
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
const JWT = process.env.JWT_SECRET;

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existinguser = await User.findOne({ email });
    if (existinguser) {
      return res.json({ message: "User is already registered !" });
    }
    //hash the password
    const hashPassword = await bcrypt.hash(password, 10);
    //create the new user
    const newUser = new User({ email, password: hashPassword, name });
    await newUser.save();

    const token = jwt.sign({ id: newUser._id }, JWT, { expiresIn: "10d" });

    res.json({
      token,
      id: newUser._id,
      name: newUser.name,
      email: newUser.email,
        isAdmin: newUser.isAdmin || "Not admin",
    });
  } catch (error) {
    console.error("Error resgitering user !", error.message);
    res.status(500).json({ message: "resgister user Error" });
  }
};
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials!" });
    }
    const checkPass = await bcrypt.compare(password, user.password);

    if (!checkPass) {
      return res.status(401).json({ message: "Invalid password!" });
    }
    const token = jwt.sign(
      {
        id: user._id,
        name: user.name, // ← Make sure this is included
        email: user.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    res.json({
      token,
      user: { id: user._id, email: user.email, name: user.name },
    });
  } catch (error) {
    console.error("Error loggin in !", error);
    res.status(500).json({ message: "login Error" });
  }
};
