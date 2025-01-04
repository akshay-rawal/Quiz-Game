import express from 'express';
import authenticate from '../../middleware/authenticate.js';
import User from "../../models/userSchema.js";

const router = express.Router();

router.get('/session', authenticate, async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized, no valid session' });
    }

    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json({   message: 'Session is valid', 
      user: {
        userId: user._id,
        username: user.username,
        email: user.email,
      }, 
      accessToken: req.token  });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch session.", error: error.message });
  }
});

export default router;
