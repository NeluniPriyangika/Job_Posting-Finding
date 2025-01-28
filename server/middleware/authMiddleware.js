const jwt = require('jsonwebtoken');
const { secret } = require('../config/jwt');

const authenticateJWT = (req, res, next) => {
  try {
    // Extract token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Access denied, no token provided' });
    }

    const token = authHeader.split(' ')[1];

    // Verify the token
    const decoded = jwt.verify(token, secret);

    // Attach user information to the request object
    req.user = decoded;

    // Proceed to the next middleware or route
    next();
  } catch (err) {
    // Handle specific JWT errors
    if (err.name === 'TokenExpiredError') {
      return res.status(403).json({ error: 'Token has expired, please log in again' });
    }
    if (err.name === 'JsonWebTokenError') {
      return res.status(403).json({ error: 'Invalid token, access denied' });
    }

    // Handle other errors
    console.error('JWT authentication error:', err);
    res.status(500).json({ error: 'An error occurred while verifying token' });
  }
};
module.exports = authenticateJWT;