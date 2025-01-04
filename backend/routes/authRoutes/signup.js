import express from "express";
import User from "../../models/userSchema.js";
import jwt from "jsonwebtoken";
import ThemePreference from "../../models/themeSchema.js";

const router = express.Router();

router.post("/signup", async (req, res) => {
  console.log("Signup route was hit");
  console.log(req.body);

  try {
    const { username, email, password } = req.body;

    // Validate email with regex
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format." });
    }

    // Check if email is already registered
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email is already registered." });
    }

    // Validate password with regex
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message:
          "Password must be at least 8 characters long, include an uppercase letter, a lowercase letter, a number, and a special character.",
      });
    }

    // Create and save new user
    const user = new User({
      username,
      email,
      password, // Password is hashed by pre('save') middleware
    });

    try {
      await user.save();
    } catch (err) {
      console.error("Error saving user:", err);
      return res.status(500).json({
        message: "Error saving user to database",
        error: err.message,
      });
    }

    // Generate tokens
    const accessToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    console.log("Test token generated successfully:", accessToken);

    const refreshToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "7d" }
    );

    // Set refresh token as cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Handle theme preference
    const themePreference = await ThemePreference.findOneAndUpdate(
      { userId: user._id },
      { $setOnInsert: { isDark: false, userId: user._id } }, // Default to light mode if not already set
      { upsert: true, new: true }
    );

    console.log("Theme Preference:", themePreference);

    // Respond with success
    res.status(201).json({
      message: "User registered successfully",
      accessToken, // Return access token
      themePreference, // Return theme preference
      user: {
        userId: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({
      message: "An error occurred during signup.",
      error: error.message,
    });
  }
});

export default router;
