const jwt = require('jsonwebtoken');
const { secret, expiresIn } = require('../config/jwt');
const User = require('../models/user');

const generateToken = (user) => {
  const payload = { id: user._id, email: user.email, userType: user.userType };
  return jwt.sign(payload, secret, { expiresIn });
};

const googleLogin = async (req, res) => {
  // Google login logic here
  const user = await User.findOne({ userId: sub });
  if (!user) {
    // New user logic
  }

  const token = generateToken(user);
  res.json({ token, user });
};

const facebookLogin = async (req, res) => {
  // Facebook login logic here
  const user = await User.findOne({ userId: userID });
  if (!user) {
    // New user logic
  }

  const token = generateToken(user);
  res.json({ token, user });
};

module.exports = { googleLogin, facebookLogin };
