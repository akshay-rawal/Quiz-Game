import express from 'express';
import User from '../../models/userSchema.js';
import jwt from "jsonwebtoken"
import ThemePreference from '../../models/themeSchema.js';
  
const router = express.Router();

router.post('/login',async (req,res)=>{

try {
    const {email,password} = req.body;
 

    //check if the user exit in database
      const user = await User.findOne({email});
    if (!user) {
        return res.status(401).json({message:"invalid credential"})
        
    }


      //compare entered password with the hashed password in the database
      const userPassword = await user.comparePassword(password);
      if (!userPassword) {
           return res.status(401).json({message:"password is incorrect"})
      }


   
    const accessToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    console.log("Signed JWT Token:", token);

    const refreshToken = jwt.sign({userId:user._id},process.env.JWT_REFRESH_SECRET
,{expiresIn:'7d'})
    
    

    res.cookie('refreshToken',refreshToken,{
      httpOnly:true,
      secure:true,
      maxAge:7*24*60*60*1000,
      //sameSite:"strict"

    })
    const themePreference = await ThemePreference.findOneAndUpdate(
      
      { userId: user._id },
      
      
      { $setOnInsert: { isDark: false,userId: user._id  } }, // Default to light mode if not already set
      { upsert: true, new: true }
  );console.log("Theme Preference:", themePreference);




      res.status(200).json({message:"login successfully",
        accessToken,themePreference,
      user: {
        userId: user._id,
        username: user.username,
        email: user.email,
      }
      })

} catch (error) {
    res.status(500).json({ message: 'Error logging in.', error: error.message });

}
})

export default router;