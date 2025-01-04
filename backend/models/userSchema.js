import mongoose from "mongoose";

import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
})

//hash password before savepush

userSchema.pre('save',async  function(next){
    if(!this.isModified('password')) return next();
    console.log("Hashing password:", this.password);
    const salt = await bcrypt.genSalt(10);
        this.password =  await bcrypt.hash(this.password,salt)
})

//compare password for login
userSchema.methods.comparePassword = async function (userPassword) {
  
    
    
    const result = await bcrypt.compare(userPassword, this.password); 


    return result
};

    


const User = mongoose.model("User",userSchema)

export default User;