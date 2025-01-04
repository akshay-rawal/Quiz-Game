import express from 'express';
const router = express.Router();

router.post('/logout',async (req,res)=>{
    res.status(200).json({ message: 'Logout successful' });

})
export default router;