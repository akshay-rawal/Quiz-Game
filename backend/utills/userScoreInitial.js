import Score from "../models/scoreSchema.js";
import Question from "../models/questionSchema.js";

export const initializeUserScore = async (userId, category) => {
  try {
    // Fetch all questions in the given category
    const questions = await Question.find({ category });

    // Extract question IDs from the fetched questions
    const questionIds = questions.map((q) => q._id);

    if (questionIds.length === 0) {
      throw new Error("No questions found in the category.");
    }

    // Initialize the user score with empty fields
    const newUserScore = new Score({
      userId,
      feedback: new Map(),
      category,
      score: 0,
      totalQuestions: questionIds.length,
      correctAnswer: [],
      inCorrectAnswer: [],
      pendingAnswer: questionIds,
      answeredQuestions: [],
      answers: [],
    });

    console.log("Initialized userScore with empty fields:", newUserScore);
    return newUserScore;
  } catch (error) {
    console.error("Error initializing user score:", error);
    throw error;
  }
};
