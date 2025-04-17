import Question from "../models/questionSchema.js";
import Score from "../models/scoreSchema.js";
import express from "express";

const router = express.Router();


router.post("/answersubmit", async (req, res) => {
  console.log("✅ POST /answersubmit hit");

  try {
    if (!req.body) {
      console.log("❌ req.body is undefined");
      return res.status(400).json({ message: "Body missing!" });
    }

    const { userId, questionId, selectedOption } = req.body;
    console.log("📦 Body received:", req.body);

    if (!userId || !questionId || !selectedOption) {
      console.log("❌ Missing field(s):", { userId, questionId, selectedOption });
      return res.status(400).json({ message: "Missing required fields" });
    }

    console.log("🔍 Looking up question:", questionId);
    const question = await Question.findById(questionId);
    if (!question) {
      console.log("❌ Question not found:", questionId);
      return res.status(404).json({ message: "Question not found." });
    }

    const isCorrect = question.correctAnswer === selectedOption;
    console.log("✅ Answer check:", { selectedOption, correctAnswer: question.correctAnswer, isCorrect });

    console.log("🔍 Finding user score for:", { userId, category: question.category });
    let userScore = await Score.findOne({ userId, category: question.category });
    if (!userScore) {
      console.log("❌ User score not found for:", userId);
      // Create a new score document for the user
      userScore = new Score({
        userId,
        category: question.category,
        score: 0,
        correctAnswer: [],
        inCorrectAnswer: [],
        answeredQuestions: [],
        answers: [],
        pendingAnswer: [],
        feedback: new Map(),
      });
      await userScore.save();
      console.log("✅ New score document created for user:", userId);
    }

    // Initialize missing fields
    userScore.correctAnswer = userScore.correctAnswer || [];
    userScore.inCorrectAnswer = userScore.inCorrectAnswer || [];
    userScore.answeredQuestions = userScore.answeredQuestions || [];
    userScore.answers = userScore.answers || [];
    userScore.pendingAnswer = userScore.pendingAnswer || [];

    console.log("📊 Current score:", userScore.score);

    if (isCorrect) {
      userScore.score += 2;
      userScore.correctAnswer.push(questionId);
      console.log("🎯 Correct answer. +2 score");
    } else {
      userScore.inCorrectAnswer.push(questionId);
      console.log("❌ Incorrect answer.");
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
    console.log("✅ Score updated and saved.");

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
    console.error("💥 Error in submit-answer route:", error.stack);
    return res.status(500).json({ message: "Error submitting answer.", error: error.message });
  }
});

export default router;
