import express from 'express';
import { insertQuestions } from './insertQuestions.js';
import Question from '../../models/questionSchema.js'; // Assuming the Question model is here
import Score from '../../models/scoreSchema.js';
import authenticate from '../../middleware/authenticate.js';
import { initializeUserScore } from '../../utills/userScoreInitial.js';

const router = express.Router();

// Route to trigger the insertion of a question (for testing purposes)
router.get('/insert-questions', async (req, res) => {
  try {
    await insertQuestions(); // Insert predefined question
    res.status(200).send('Question inserted successfully!');
  } catch (error) {
    res.status(500).send('Failed to insert question: ' + error.message);
  }
});


// Route to get questions by category (e.g., 'Cinema')
router.get("/questions/:category/:userId",authenticate, async (req, res) => {
  const { category,userId} = req.params;
  const page = parseInt(req.query.page)||1;
  const limit = parseInt(req.query.limit) || 5;


  if (req.userId !== userId) {
    return res.status(403).json({ message: "You are not authorized to access these questions." });
  }

  try {
    let userScore = await Score.findOne({ category, userId });
    if (!userScore) {
      userScore = await initializeUserScore(userId, category);
      // Save the initialized user score to the database
      await userScore.save();
    }

     const totalQuestions = await Question.countDocuments({category})
     const skip = (page-1) * limit



    const questions = await Question.find({ category })
    .skip(skip)
    .limit(limit);
    console.log("Questions found:", questions);
  

    const answeredQuestionIds = userScore
    ? userScore.answeredQuestions.map((id) => id.toString())
    : [];

  const questionsWithStatus = questions.map((q) => ({
    ...q._doc, // Spread original question data
    isAnswered: answeredQuestionIds.includes(q._id.toString()), // Add isAnswered flag
  }));
  const pendingAnswerCount = (userScore.pendingAnswer && userScore.pendingAnswer.length) || 0;
  return res.status(200).json({ questions: questionsWithStatus, pendingAnswerCount, totalQuestions, totalPages: Math.ceil(totalQuestions / limit), currentPage: page });

  } catch (error) {
    return res.status(500).json({ message: "Error fetching questions from the database." });
  }
}); 

export default router;