const express = require('express');
const router = express.Router();
const User = require('../models/user');

// Remove authentication for public company listings
router.get('/companies', async (req, res) => {
  try {
    // Fetch all completed company profiles
    const companys = await User.find({
      userType: 'company',
      profileCompleted: true
    }).select('fullName qualifications description perMinuteRate profilePhotoUrl');

    if (!companys || companys.length === 0) {
      return res.status(404).json({ message: 'No companys found' });
    }

    // Format the response data
    const responseData = companys.map(company => ({
      id: company._id,
      title: company.fullName || 'Company',
      subtitle: company.qualifications || 'Psychic Reading, Astrology, Tarot Readings',
      personalDes: company.description || 'No description available',
      timeText: `$ ${company.perMinuteRate || 0} per minute`,
      imgUrl: company.profilePhotoUrl || '/default-avatar.png'
    }));

    res.status(200).json({ companys: responseData });
  } catch (error) {
    console.error('Error fetching companys:', error);
    res.status(500).json({ error: 'Failed to fetch companys' });
  }
});


module.exports = router;