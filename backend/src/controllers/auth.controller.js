import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );
};

export const login = async (req, res) => {
  try {
    let { email, password } = req.body;

    email = email?.trim().toLowerCase();

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
    const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;

    // Admin login
    if (email === adminEmail) {
      if (!adminPasswordHash) {
        console.error("ADMIN_PASSWORD_HASH is missing");

        return res.status(500).json({
          success: false,
          message: "Admin configuration error",
        });
      }

      const passwordMatches = await bcrypt.compare(
        password,
        adminPasswordHash
      );

      if (!passwordMatches) {
        return res.status(401).json({
          success: false,
          message: "Invalid email or password",
        });
      }

      const token = generateToken("admin");

      return res.status(200).json({
        success: true,
        token,
        user: {
          id: "admin",
          role: "admin",
          email: process.env.ADMIN_EMAIL,
        },
      });
    }

    // Normal user login
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const passwordMatches = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordMatches) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = generateToken(user._id.toString());

    return res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        role: user.role || "user",
      },
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Login failed",
    });
  }
};

export const me = async (req, res) => {
  try {
    // Special admin user
    if (req.user?.id === "admin") {
      return res.json({
        success: true,
        user: {
          id: "admin",
          role: "admin",
          email: process.env.ADMIN_EMAIL,
        },
      });
    }

    return res.json({
      success: true,
      user: req.user,
    });
  } catch (error) {
    console.error("ME ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch user",
    });
  }
};