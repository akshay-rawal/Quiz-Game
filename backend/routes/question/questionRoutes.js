import express from "express";
import { insertQuestions } from "./insertQuestions.js";
import Question from "../../models/questionSchema.js";
import Score from "../../models/scoreSchema.js";
import authenticate from "../../middleware/authenticate.js";
import { initializeUserScore } from "../../utills/userScoreInitial.js";

const router = express.Router();

// In-memory cache for guest user data
const guestUserCache = {};

// Route to trigger the insertion of a question (for testing purposes)
router.get("/insert-questions", async (req, res) => {
  try {
    await insertQuestions();
    res.status(200).send("Question inserted successfully!");
  } catch (error) {
    res.status(500).send("Failed to insert question: " + error.message);
  }
});

// Route to get questions by category (e.g., 'Cinema')
router.get("/questions/:category/:userId", async (req, res) => {
  const { category, userId } = req.params;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;

  const isGuestUser = userId === "guest";

  try {
    if (!isGuestUser) {
      // Authenticate for regular users
      await authenticate(req, res, () => {
        if (req.userId !== userId) {
          return res
            .status(403)
            .json({ message: "You are not authorized to access these questions." });
        }
      });
    }

    let userScore;
    if (isGuestUser) {
      // Handle guest user in cache
      if (!guestUserCache[category]) {
        const questions = await Question.find({ category }).limit(10); // Limit to avoid memory issues

        guestUserCache[category] = {
          answeredQuestions: [],
          pendingAnswer: [],
          score: 0,
          correctAnswer: [],
          inCorrectAnswer: [],
          questions: questions.map((q) => q.toObject()), // Convert MongoDB documents to plain objects

        };
      }
      userScore = guestUserCache[category];
    } else {
      // Handle regular user in DB
      userScore = await Score.findOne({ category, userId });
      if (!userScore) {
        userScore = await initializeUserScore(userId, category);
        await userScore.save();
      }
    }

    const totalQuestions = await Question.countDocuments({ category });
    const skip = (page - 1) * limit;

    const questions = await Question.find({ category })
      .skip(skip)
      .limit(limit);

    const answeredQuestionIds = userScore
      ? userScore.answeredQuestions.map((id) => id.toString())
      : [];

    const questionsWithStatus = questions.map((q) => ({
      ...q._doc,
      isAnswered: answeredQuestionIds.includes(q._id.toString()),
    }));

    const pendingAnswerCount =
      (userScore.pendingAnswer && userScore.pendingAnswer.length) || 0;

    return res.status(200).json({
      questions: questionsWithStatus,
      pendingAnswerCount,
      totalQuestions,
      totalPages: Math.ceil(totalQuestions / limit),
      currentPage: page,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error fetching questions from the database." });
  }
});

// Route to submit answers (supports guest users)
router.post("/submit", async (req, res) => {
  const { userId, questionId, selectedOption } = req.body;
  const isGuestUser = userId === "guest";

  try {
    const question = await Question.findById(questionId);
    if (!question) {
      return res.status(404).json({ message: "Question not found." });
    }

    const isCorrect = question.correctOption === selectedOption;
    let userScore;

    if (isGuestUser) {
      // Update guest user score in cache
      const guestScore = guestUserCache[question.category];
      if (!guestScore) {
        return res.status(400).json({ message: "Guest user data not found." });
      }
      guestScore.score += isCorrect ? 1 : 0;
      guestScore.correctAnswer = isCorrect
        ? [...guestScore.correctAnswer, questionId]
        : guestScore.correctAnswer;
      guestScore.inCorrectAnswer = !isCorrect
        ? [...guestScore.inCorrectAnswer, questionId]
        : guestScore.inCorrectAnswer;
      userScore = guestScore;
    } else {
      // Update regular user score in DB
      userScore = await Score.findOne({ userId, category: question.category });
      if (!userScore) {
        return res.status(404).json({ message: "User score not found." });
      }
      userScore.score += isCorrect ? 1 : 0;
      if (isCorrect) {
        userScore.correctAnswer.push(questionId);
      } else {
        userScore.inCorrectAnswer.push(questionId);
      }
      await userScore.save();
    }

    return res.status(200).json({
      isCorrect,
      updatedScore: userScore.score,
      feedbackMessage: isCorrect
        ? "Correct answer!"
        : "Incorrect answer. Try again!",
    });
  } catch (error) {
    return res.status(500).json({ message: "Error submitting answer." });
  }
});

export default router;
