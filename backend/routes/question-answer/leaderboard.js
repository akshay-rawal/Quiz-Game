import express from "express";
import Score from "../../models/scoreSchema.js";
import mongoose from "mongoose";
import authenticate from "../../middleware/authenticate.js";

const router = express.Router();

const guestUserCache = {}; // In-memory cache

// Leaderboard route
router.get("/leaderboard", authenticate, async (req, res) => {
  const isGuestUser = req.query.guest === "true";
  console.log("GET /leaderboard called");
  console.log("Is Guest User:", isGuestUser);

  try {
    if (isGuestUser) {
      console.log("Handling Guest User Leaderboard");

      const leaderboard = Object.entries(guestUserCache).map(([category, data]) => {
        console.log(`Guest Category: ${category}`, data);
        return {
          _id: category,
          totalScore: data.score,
          correctAnswers: data.correctAnswer.length,
          incorrectAnswers: data.inCorrectAnswer.length,
          pendingAnswers: data.pendingAnswer.length,
        };
      });

      console.log("Guest Leaderboard:", leaderboard);
      return res.status(200).json({ leaderboard });
    }

    // Authenticated User
    const authenticatedUserId = req.userId;
    console.log("Authenticated User ID:", authenticatedUserId);

    if (!authenticatedUserId) {
      console.log("No authenticated user ID found in request.");
      return res.status(401).json({ message: "Unauthorized access." });
    }

    const userScores = await Score.aggregate(
      [

      { $match: { userId: new mongoose.Types.ObjectId(authenticatedUserId) } },
      {
        $group: {
          _id: "$category", // Now this is just a string like "Cinema"
          totalScore: { $sum: "$score" },
          correctAnswers: { $sum: { $size: "$correctAnswer" } },
          incorrectAnswers: { $sum: { $size: "$inCorrectAnswer" } },
          pendingAnswers: { $sum: { $size: "$pendingAnswer" } },
        },
      },
      {
        $project: {
          category: "$_id",
          totalScore: 1,
          correctAnswers: 1,
          incorrectAnswers: 1,
          pendingAnswers: 1,
          _id: 0,
        },
      },
      { $sort: { totalScore: -1 } },
    ]);
    

    console.log("User Scores from DB:", userScores);
    return res.status(200).json({ leaderboard: userScores });
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    return res.status(500).json({ message: "Error fetching leaderboard." });
  }
});

export default router;
