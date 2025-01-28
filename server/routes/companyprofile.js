const express = require('express');
const router = express.Router();
const User = require('../models/user');

router.get('/company-profile/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId || userId === 'undefined') {
      return res.status(400).json({ error: 'Valid user ID required' });
    }

    const company = await User.findOne({ userId: userId }).lean();

    if (!company) {
      return res.status(404).json({ error: 'Company not found' });
    }

    if (company.userType !== 'company') {
      return res.status(403).json({ error: 'Requested user is not an company' });
    }

    // Match the response fields with your user model
    res.json({
      userId: company.userId,
      name: company.fullName || company.name,
      email: company.email,
      experience: company.qualifications,
      bio: company.description,
      certifications: company.certifications,
      availableDays: company.availableDays,
      availableTimeStart: company.availableHoursstart,
      availableTimeEnd: company.availableHoursend,
      ratePerMinute: company.perMinuteRate?.amount || 0,
      languages: company.languages,
      profilePhotoUrl: company.profilePhotoUrl,
      profileCompleted: company.profileCompleted
    });

  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({
      error: 'Failed to fetch company profile',
      details: error.message
    });
  }
});

module.exports = router;