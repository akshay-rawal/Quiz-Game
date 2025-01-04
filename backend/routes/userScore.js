
import express from 'express';

import Score from '../models/scoreSchema.js';

const router = express.Router()
router.get('/user-score/:userId/:category', async (req, res) => {
  const { userId, category } = req.params;

  try {
    const userScore = await Score.findOne({ userId, category });

    if (!userScore || userScore.answers.length === 0) {
      return res.status(200).json({
        message: 'No scores available for this category.',
      });
    }

    res.status(200).json({
      userScore
    });
  } catch (error) {
    console.error('Error fetching user score:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
