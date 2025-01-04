import mongoose from "mongoose";

const questionSchema = new mongoose.Schema(
    {
        questionText: {
            type: String,
            required: true,
        },
        options: [
            {   
                type: [String],
                required: true,
                validate: (optionsArray) => optionsArray.length === 4, // Ensure there are 4 options
            
                    message:"there must be four options"
                
            },
        ],
        correctAnswer: {
            type: String, 
            required: true,
            enum:['A','B','C','D']
        },
        category: {
            type: String,
            required: true,
            enum: ['Cinema', "General Knowledge", "History", "Politics"], // Same categories as in Score schema
        },
    },
    { timestamps: true }
);

const Question = mongoose.model("Question", questionSchema);

export default Question;
