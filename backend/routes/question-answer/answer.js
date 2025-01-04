import express from "express";
import Question from "../../models/questionSchema.js"
import Score from "../../models/scoreSchema.js";

const router = express.Router();

router.post('/answer',async (req,res)=>{
  try {
    const {userId,questionId,selectedOption} = req.body

    const question = await Question.findById(questionId)
    if (!question) {
      return res.status(404).json({ message: "Question not found" });
  }

         //check selected option is correct
           const isCorrect = question.correctAnswer === selectedOption
           //find or create score doucment for user in category
             const score = await Score.findOne({userId,category:question.category})

             if (!score) {
              score = new Score({
                userId,
                category:question.category,
                score:0,
                answers:[]
              })
             }

             //only store the answer user select from options
             if (selectedOption) {
              
              if (isCorrect) {
                  score.score += 1  
              }

              score.answers.push({
                questionId:question._id,
                selectedOption,
                isCorrect,
                category:question.category,

              });
                
                score.save;

             }

             //return the result
             res.status(200).json({
              message:selectedOption?isCorrect?"correct answer":"incorrect answer":"no answer selected",
              isCorrect:selectedOption?isCorrect:null,
              correctAnswer:selectedOption?correctAnswer:null

             })

  } catch (error) {
    
      res.status(500).json({ message: "Server error", error: error.message });
  }
    
  
})

export default router