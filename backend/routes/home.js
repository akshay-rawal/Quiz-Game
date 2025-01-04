import express from 'express';
import authenticate from '../middleware/authenticate.js';

const router = express.Router();
 
router.get('/home',authenticate,(req,res)=>{
    res.status(200).json({
        user_id:req.user._id,
        username:req.user.username,
        email:req.user.email
    })
})

export default router;