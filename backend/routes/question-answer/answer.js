import express from "express";
import Question from "../../models/questionSchema.js";
import Score from "../../models/scoreSchema.js";

const router = express.Router();

router.post('/answer', async (req, res) => {
  try {
    const { userId, questionId, selectedOption } = req.body;

    const question = await Question.findById(questionId);
    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    // Check selected option is correct
    const isCorrect = question.correctAnswer === selectedOption;
    
    // Find or create score document for user in category
    let score = await Score.findOne({ userId, category: question.category });

    if (!score) {
      score = new Score({
        userId,
        category: question.category,
        score: 0,
        correctAnswer: [],
        inCorrectAnswer: [],
        answeredQuestions: [],
        answers: [],
        pendingAnswer: [],
        feedback: new Map()
      });
    }

    // Only store the answer user selects
    if (selectedOption) {
      if (isCorrect) {
        score.score += 1;
      }

      score.answers.push({
        questionId: question._id,
        selectedOption,
        isCorrect,
        category: question.category,
      });

      await score.save(); // Save the score
    }

    // Return the result
    res.status(200).json({
      message: selectedOption ? (isCorrect ? "Correct answer" : "Incorrect answer") : "No answer selected",
      isCorrect: selectedOption ? isCorrect : null,
      correctAnswer: selectedOption ? question.correctAnswer : null
    });

  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

export default router;
