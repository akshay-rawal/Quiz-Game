import Question from "../models/questionSchema.js";
import Score from "../models/scoreSchema.js";
import express from "express";
const router = express.Router();


router.post("/submit-answer", async (req, res) => {
  console.log("✅ POST /submit-answer hit", req.body);

  try {
    const { userId, questionId, selectedOption } = req.body;

    if (!userId || !questionId || !selectedOption) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const question = await Question.findById(questionId);
    if (!question) {
      return res.status(404).json({ message: "Question not found." });
    }

    const isCorrect = question.correctAnswer === selectedOption;

    let userScore = await Score.findOne({ userId, category: question.category });
    if (!userScore) {
      return res.status(404).json({ message: "User score not found." });
    }

    // Initialize userScore fields if they don't exist
    userScore.correctAnswer = userScore.correctAnswer || [];
    userScore.inCorrectAnswer = userScore.inCorrectAnswer || [];
    userScore.answeredQuestions = userScore.answeredQuestions || [];
    userScore.answers = userScore.answers || [];
    userScore.pendingAnswer = userScore.pendingAnswer || [];

    if (isCorrect) {
      userScore.score += 2;
      userScore.correctAnswer.push(questionId);
    } else {
      userScore.inCorrectAnswer.push(questionId);
    }

    userScore.feedback.set(questionId.toString(), isCorrect ? "Correct answer!" : "Incorrect answer.");
    userScore.answeredQuestions.push(questionId);
    userScore.pendingAnswer = userScore.pendingAnswer.filter(
      (id) => id.toString() !== questionId.toString()
    );

    userScore.answers.push({
      questionId,
      selectedOption,
      isCorrect,
      category: question.category,
    });

    await userScore.save();

    return res.status(200).json({
      message: "Answer submitted successfully.",
      isCorrect,
      feedbackMessage: isCorrect ? "Correct answer!" : "Incorrect answer.",
      updatedScore: userScore.score,
      totalQuestions: userScore.totalQuestions,
      pendingQuestions: userScore.pendingAnswer.length,
      hasAnswerd: userScore.answeredQuestions.includes(questionId),
    });
  } catch (error) {
    console.error("Error in submit-answer route:", error); // Log the error
    return res.status(500).json({ message: "Error submitting answer.", error: error.message });
  }
});

console.log("SubmitAnswer route file loaded");

router.get("/test", (req, res) => {
  console.log("Test route hit!");
  res.send("✅ Test route is working!");
});


export default router;
