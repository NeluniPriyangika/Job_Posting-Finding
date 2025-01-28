// server/middleware/authHandlers.js
const User = require('../models/user');

const authHandlers = {
  findUserByPriority: async ({ userId, email }) => {
    try {
      let user = null;
      let authType = null;

      // Priority 1: Direct ID
      if (userId) {
        user = await User.findById(userId) || await FBUser.findById(userId);
        authType = user?.userId ? 'google' : 'facebook';
      }
      // Priority 2: Google ID
      else if (userId) {
        user = await User.findOne({ userId });
        authType = 'google';
      }
      // Priority 3: Facebook ID
      else if (facebookId) {
        user = await FBUser.findOne({ facebookId });
        authType = 'facebook';
      }
      // Priority 4: Email
      else if (email) {
        user = await User.findOne({ email }) || await FBUser.findOne({ email });
        authType = user?.userId ? 'google' : 'facebook';
      }

      if (!user) {
        return null;
      }

      return {
        user,
        authType
      };
    } catch (error) {
      console.error('Find user error:', error);
      throw error;
    }
  },

  getCurrentUser: async (credentials) => {
    try {
      return await authHandlers.findUserByPriority(credentials);
    } catch (error) {
      console.error('Get current user error:', error);
      throw error;
    }
  }
};

module.exports = authHandlers;