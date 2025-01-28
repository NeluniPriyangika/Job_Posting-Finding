const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');
const jwt = require('jsonwebtoken'); // Import JWT library
const User = require('../models/user');

// POST: Facebook Login
router.post('/facebook-login', async (req, res) => {
  console.log('Received Facebook login request:', req.body);

  try {
    const { accessToken, userID, email, name, userType } = req.body;

    // Validate required fields
    if (!accessToken || !userID || !email || !name || !userType) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Verify Facebook token
    const verifyTokenUrl = `https://graph.facebook.com/debug_token?input_token=${accessToken}&access_token=${process.env.FACEBOOK_APP_ID}|${process.env.FACEBOOK_APP_SECRET}`;
    const tokenResponse = await fetch(verifyTokenUrl);
    const tokenData = await tokenResponse.json();

    if (!tokenData.data || !tokenData.data.is_valid) {
      return res.status(400).json({ error: 'Invalid Facebook token' });
    }

    // Get additional user data from Facebook
    const fbUserResponse = await fetch(`https://graph.facebook.com/v19.0/${userID}?fields=id,name,email,picture&access_token=${accessToken}`);
    const fbUserData = await fbUserResponse.json();

    // Check if user exists
    let user = await User.findOne({ userId: userID });
    let isNewUser = false;

    if (!user) {
      // Create new user
      user = new User({
        userId: userID,
        email,
        name,
        userType,
        profilePhotoUrl: fbUserData.picture?.data?.url,
        profileCompleted: false,
        socialLinks: { facebook: `https://facebook.com/${userID}` },
      });
      await user.save();
      isNewUser = true;
    } else {
      // Update existing user if necessary
      if (!user.profilePhotoUrl) {
        user.profilePhotoUrl = fbUserData.picture?.data?.url;
        user.socialLinks.facebook = `https://facebook.com/${userID}`;
        await user.save();
      }
    }

    // Generate JWT
    const token = jwt.sign(
      { userId: user.userId, email: user.email, userType: user.userType },
      process.env.JWT_SECRET, // Secure secret key
      { expiresIn: '1h' } // Token expiration
    );

    // Determine redirect path
    const redirectTo = isNewUser || !user.profileCompleted
      ? userType === 'company' ? `/company-update-profile/${userID}` : `/seeker-update-profile/${userID}`
      : user.userType === 'company' ? `/company-profile/${user.userId}` : `/seeker-profile/${user.userId}`;

    return res.status(200).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        userType: user.userType,
        profileCompleted: user.profileCompleted,
        profilePhotoUrl: user.profilePhotoUrl,
      },
      token,
      redirectTo,
      isNewUser,
    });
  } catch (error) {
    console.error('Facebook authentication error:', error);
    return res.status(500).json({ error: 'Authentication failed' });
  }
});

// Middleware: Verify JWT
const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1]; // Extract token from Authorization header

  if (!token) {
    return res.status(401).json({ error: 'Token is missing' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user; // Attach decoded user info to request
    next();
  });
};

// GET: Fetch Facebook Current User (Protected Route)
router.get('/facebook-current-user', authenticateToken, async (req, res) => {
  try {
    const { email, userId } = req.query;

    const user = await User.findOne(userId ? { userId } : { email });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    console.error('Error fetching Facebook user:', error);
    res.status(500).json({ error: 'Failed to fetch user data' });
  }
});

// GET: Fetch Facebook Current Companys (Protected Route)
router.get('/facebook-companys', authenticateToken, async (req, res) => {
  try {
    const { userType } = req.query;

    // Validate userType (ensure it's 'company')
    if (userType !== 'company') {
      return res.status(400).json({ error: 'Invalid user type' });
    }

    // Fetch companys who logged in via Facebook
    const companys = await User.find({ userType: 'company', socialLinks: { $exists: true, $ne: null } });

    if (!companys || companys.length === 0) {
      return res.status(404).json({ error: 'No companys found' });
    }

    res.json({ companys });
  } catch (error) {
    console.error('Error fetching Facebook companys:', error);
    res.status(500).json({ error: 'Failed to fetch companys' });
  }
});


module.exports = router;
