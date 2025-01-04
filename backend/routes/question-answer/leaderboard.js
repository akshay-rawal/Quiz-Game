import express from "express";
import Score from "../../models/scoreSchema.js";
import mongoose from "mongoose";

import authenticate from '../../middleware/authenticate.js';

const router = express.Router()
router.get("/leaderboard", authenticate, async (req, res) => {
    console.log("received token:",req.headers.authorization);
    console.log('Authenticated User ID:', req.userId);

    try {
        if (!req.userId) {
            console.log("Request rejected: User not authenticated");
            return res.status(401).json({ message: "User not authenticated." });
        }

        const authenticatedUserId = req.userId;

        // Fetch scores grouped by user and category
        const userScores = await Score.aggregate([
            { $match: { userId: new mongoose.Types.ObjectId(authenticatedUserId) } },
            
            {
                $group: {
                    _id: "$category",
                    totalScore: { $sum: "$score" },
                    correctAnswers: { $sum: { $size: "$correctAnswer" } },
                    incorrectAnswers: { $sum: { $size: "$inCorrectAnswer" } },
                    pendingAnswers: { $sum: { $size: "$pendingAnswer" } },
                },
            },
            { $sort: { totalScore: -1 } }, // Sort categories by total score
        ]);
        console.log("Aggregation Output:", userScores);
        console.log("Aggregation match for userId:", authenticatedUserId);
        if (!userScores.length) {
            console.log("No scores found for user:", authenticatedUserId);
            return res.status(404).json({ message: "No scores found for this user." });
        }

        return res.status(200).json({ leaderboard: userScores });
    } catch (error) {
        console.error("Error fetching leaderboard:", error);
        return res.status(500).json({ message: "Error fetching leaderboard." });
    }
});




export default router;