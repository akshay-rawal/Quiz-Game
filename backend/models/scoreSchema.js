import mongoose from "mongoose";

const scoreSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Cinema', "General Knowledge", "History", "Politics"]
  },
  score: {
    type: Number,
    required: true,
    default: 0
  },
  correctAnswer: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Question",
    default: []
  },
  inCorrectAnswer: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Question",
    default: []
  },
  answeredQuestions: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Question",
    default: []
  },
  answers: [
    {
      questionId: { type: mongoose.Schema.Types.ObjectId, ref: "Question", required: true },
      selectedOption: { type: String, required: true },
      isCorrect: { type: Boolean, required: true },
      category: { type: String, required: true, enum: ['Cinema', "General Knowledge", "History", "Politics"] }
    }
  ],
  feedback: {
    type: Map,
    of: String, // Map of questionId to feedback message
    default: new Map()
  },
  pendingAnswer: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Question",
    default: []
  }
}, { timestamps: true });

const Score = mongoose.model("Score", scoreSchema);
export default Score;
