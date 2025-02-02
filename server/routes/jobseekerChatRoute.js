const express = require('express');
const router = express.Router();
const { SeekerMessage, SeekerChatSession } = require('../models/seekerChatModel');
const User = require('../models/user');

// Get seeker by ID
router.get('/jobseeker/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    const user = await User.findOne({ userId });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.userType !== 'seeker') {
      return res.status(403).json({ error: 'User is not a seeker' });
    }

    res.json({ user });
  } catch (error) {
    console.error('Error fetching seeker:', error);
    res.status(500).json({ error: 'Failed to fetch seeker' });
  }
});

// Create new chat session
router.post('/seeker-session/:userId', async (req, res) => {
  try {
    const { seekerId, companyId } = req.body;

    if (!seekerId || !companyId) {
      return res.status(400).json({ error: 'Both seekerId and companyId are required' });
    }

    // Verify both users exist
    const seeker = await User.findOne({ userId: seekerId });
    const company = await User.findOne({ userId: companyId });

    if (!seeker || !company) {
      return res.status(404).json({ error: 'Seeker or company not found' });
    }

    if (seeker.userType !== 'seeker') {
      return res.status(403).json({ error: 'User is not registered as a seeker' });
    }

    const seekerSession = new SeekerChatSession({
      seeker: seeker._id,
      company: company._id,
      startTime: new Date(),
      status: 'active'
    });

    await seekerSession.save();
    
    // Populate company details before sending response
    await seekerSession.populate('company');
    res.status(201).json(seekerSession);
  } catch (error) {
    console.error('Session creation error:', error);
    res.status(500).json({ error: 'Failed to create chat session' });
  }
});

// Send message
router.post('/seeker-message/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { sessionId, text, position } = req.body;

    if (!sessionId || !text || !position) {
      return res.status(400).json({ error: 'SessionId, text and position are required' });
    }

    const session = await SeekerChatSession.findOne({
      _id: sessionId,
      status: 'active'
    });

    if (!session) {
      return res.status(404).json({ error: 'Active chat session not found' });
    }

    const seekerMessage = new SeekerMessage({
      sessionId: session._id,
      senderId: userId,
      text,
      position,
      type: 'text',
      timestamp: new Date()
    });

    session.messages.push(seekerMessage);
    await session.save();

    // Emit through socket if available
    if (req.app.get('io')) {
      req.app.get('io').to(session._id.toString()).emit('message', seekerMessage);
    }

    res.status(201).json(seekerMessage);
  } catch (error) {
    console.error('Message sending error:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

// Get chat history
router.get('/seeker-history/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findOne({ userId });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const sessions = await SeekerChatSession.find({
      seeker: user._id
    })
    .populate('company messages')
    .sort({ startTime: -1 });

    res.json(sessions);
  } catch (error) {
    console.error('History fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch chat history' });
  }
});

module.exports = router;