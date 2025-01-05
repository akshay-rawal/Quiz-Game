import express from "express";
import Score from "../../models/scoreSchema.js";
import mongoose from "mongoose";
import authenticate from "../../middleware/authenticate.js";

const router = express.Router();

// In-memory cache for guest user data (should be maintained in memory)
const guestUserCache = {}; // Ensure this is initialized somewhere else in the application

// Route to get the leaderboard
router.get("/leaderboard", async (req, res) => {
  const isGuestUser = req.query.guest === "true"; // Check if the request is for a guest user
  
  try {
    if (isGuestUser) {
      // Fetch guest user leaderboard data from the cache
      const leaderboard = Object.entries(guestUserCache).map(([category, data]) => ({
        _id: category,
        totalScore: data.score,
        correctAnswers: data.correctAnswer.length,
        incorrectAnswers: data.inCorrectAnswer.length,
        pendingAnswers: data.pendingAnswer.length,
      }));

      return res.status(200).json({ leaderboard });
    }

    // For regular authenticated users, fetch data from the database
    const authenticatedUserId = req.userId;
    
    // Aggregate user scores by category for the authenticated user
    const userScores = await Score.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(authenticatedUserId) } },
      {
        $group: {
          _id: "$category", // Group by category
          totalScore: { $sum: "$score" }, // Sum up the scores
          correctAnswers: { $sum: { $size: "$correctAnswer" } }, // Count of correct answers
          incorrectAnswers: { $sum: { $size: "$inCorrectAnswer" } }, // Count of incorrect answers
          pendingAnswers: { $sum: { $size: "$pendingAnswer" } }, // Count of pending answers
        },
      },
      { $sort: { totalScore: -1 } }, // Sort by total score in descending order
    ]);

    return res.status(200).json({ leaderboard: userScores });
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    return res.status(500).json({ message: "Error fetching leaderboard." });
  }
});

export default router;
