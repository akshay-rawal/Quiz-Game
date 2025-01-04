import express from 'express';

const router = express.Router();


router.get('/guest', (req, res) => {
    const guestUser = {
      userId: 'guest-' + Date.now(),  // Temporary unique ID
      username: 'Guest User',
      role: 'guest',
    };
  
    // Return the guest user data
    res.json(guestUser);
  });

  export default router