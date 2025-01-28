const express = require('express');
const router = express.Router();
const User = require('../models/user');

router.get('/seeker-profile/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId || userId === 'undefined') {
      return res.status(400).json({ error: 'Valid user ID required' });
    }

    const seeker = await User.findOne({ userId: userId }).lean();

    if (!seeker) {
      return res.status(404).json({ error: 'Seeker not found' });
    }

    if (seeker.userType !== 'seeker') {
      return res.status(403).json({ error: 'Requested user is not an seeker' });
    }

    // Match the response fields with your user model
    res.json({
      userId: seeker.userId,
      name: seeker.fullName || seeker.name,
      email: seeker.email,  
      fullName: seeker.fullName,
      address: seeker.address,
      phoneNumber: seeker.phoneNumber,
      description: seeker.description,
      languages: seeker.language,
      birthday: seeker.birthday,
      interest: seeker.interest,
      profilePhotoUrl: seeker.profilePhotoUrl,
      profileCompleted: seeker.profileCompleted
    });

  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({
      error: 'Failed to fetch seeker profile',
      details: error.message
    });
  }
});

module.exports = router;