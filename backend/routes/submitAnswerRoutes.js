import Question from "../models/questionSchema.js";
import Score from "../models/scoreSchema.js";
import express from "express";
import { initializeUserScore } from "../utills/userScoreInitial.js";
const router = express.Router();

export const submitAnswerRoutes = async (req, res) => {
  try {
    const { userId, questionId, selectedOption } = req.body;

    // Check if the required fields are provided
    if (!userId || !questionId || !selectedOption) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Fetch the question from the database
    const question = await Question.findById(questionId);
    if (!question) {
      return res.status(404).json({ message: "Question not found." });
    }

    console.log("Category from request body:", question.category);

    // Check if the answer is correct
    const isCorrect = question.correctAnswer === selectedOption;

    // Fetch or create the user's score record
    console.log("Searching for userScore with userId:", userId, "and category:", question.category);

    let userScore = await Score.findOne({ userId, category: question.category });

   
        
      
      
    // Ensure fields are initialized if missing
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
    const feedbackMessage = isCorrect ? "Correct answer!" : "Incorrect answer.";
    userScore.feedback.set(questionId.toString(), feedbackMessage);
    userScore.answeredQuestions.push(questionId); // Mark as answered
    userScore.pendingAnswer = userScore.pendingAnswer.filter(
      (id) => id.toString() !== questionId.toString()
    );
    console.log("Updated pendingAnswer after filtering:", userScore.pendingAnswer);

    userScore.answers.push({
      questionId,
      selectedOption,
      isCorrect,
      category: question.category,
    });

 

    // Save the updated user score
    await userScore.save();

    const hasAnswerd = userScore.answeredQuestions.includes(questionId)
    const pendingQuestions = userScore.pendingAnswer.length;
    const totalQuestions = userScore.totalQuestions;

 
  
    return res.status(200).json({
      message: "Answer submitted successfully.",
      isCorrect,
      feedbackMessage,
      updatedScore:userScore.score,
      totalQuestions,
      pendingQuestions, 
      hasAnswerd,
    }
  );

  } catch (error) {
    return res.status(500).json({ message: "Error submitting answer." });
  }
};

router.post("/submit", submitAnswerRoutes);

export default router;
