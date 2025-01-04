
 import User from "../../models/userSchema.js";
  import express from 'express';
  import jwt from "jsonwebtoken"

  const router = express.Router();




router.get('/refresh', async (req,res)=>{
    const refreshToken = req.cookies.refreshToken


    if (!refreshToken) {
      return res.status(403).json({ message: "No refresh token found" });
    }
    try {
      // Verify the refresh token
      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
      const user = await User.findById(decoded.userId);
      if (!user) {
        return res.status(403).json({ message: "Invalid refresh token" });
      }
      const newAccessToken = jwt.sign({userId:user._id},process.env.JWT_SECRET,{expiresIn:'1h'})
      res.status(200).json({ accessToken: newAccessToken });
    } catch (error) {
      res.status(403).json({ message: "Invalid refresh token" });
    }
  })

  export default router;