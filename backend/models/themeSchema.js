import mongoose from "mongoose";

const themeSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true,

    },
    isDark:{
        type:Boolean,
        required:true

    },
    updateAt:{
        type:Date,
        default:Date.now
    },
});

const ThemePreference = mongoose.model("ThemePreference",themeSchema)

export default ThemePreference;