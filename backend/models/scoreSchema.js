    import mongoose from "mongoose";


    const scoreSchema = new mongoose.Schema({
        userId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            required:true
        },
        category:{  
            type:String,
            required:true,
            enum:['Cinema',"General Knowledge","History","Politics"]
        },
        totalQuestions:{
            type:Number,
            required:true,
            default: 0,
        },
        score:{
            type:Number,
            required:true,
            default:0
        },
        correctAnswer:{
            type: [mongoose.Schema.Types.ObjectId],
            ref: "Question",
            default: [],
        }, 
        inCorrectAnswer: {
            type: [mongoose.Schema.Types.ObjectId],
            ref: "Question",
            default: [],
        },
        pendingAnswer: {
            type: [mongoose.Schema.Types.ObjectId],
            ref: "Question",
            default: [],
        },
        answeredQuestions: {
            type: [mongoose.Schema.Types.ObjectId], // IDs of answered questions
            ref: "Question",
            default: [],
        },
       // timeTaken: { type: Number, required: true }, // time in seconds

    answers:[
        {  questionId:{type:mongoose.Schema.Types.ObjectId,ref:"Question",required:true},
        
            selectedOption:{type:String,required:true},
            isCorrect:{type:Boolean,required:true},
            category:{
                type:String,
                required:true,
                enum:['Cinema',"General Knowledge","History","Politics"]
            },
            feedback: {
                type: Map,
                of: String, // Map of questionId to feedback message
              },
        
        
        }

    ],
    feedback: {
        type: Map,
        of: String, // Map of questionId to feedback message
      },
        
    
    
    },
    {timestamps:true} 
    )

    const Score = mongoose.model("Score",scoreSchema);
    export default Score;