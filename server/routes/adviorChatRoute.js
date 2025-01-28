const express = require('express');
const router = express.Router();
const { CompanyMessage, CompanyChatSession } = require('../models/companyChatModel');
const User = require('../models/user');

// Create new chat session
router.post('/company-session/:userId', async (req, res) => {
  try {
    const { companyId, seekerId } = req.body;

    if (!companyId || !seekerId) {
      return res.status(400).json({ error: 'Both companyId and seekerId are required' });
    }

    // Verify both users exist and company has correct type
    const company = await User.findOne({ userId: companyId });
    const seeker = await User.findOne({ userId: seekerId });

    if (!company || !seeker) {
      return res.status(404).json({ error: 'Company or seeker not found' });
    }

    if (company.userType !== 'company') {
      return res.status(403).json({ error: 'Specified company is not registered as an company' });
    }

    const companySession = new CompanyChatSession({
      company: company._id,
      seeker: seeker._id,
      startTime: new Date(),
      status: 'active'
    });

    await companySession.save();
    res.status(201).json(companySession);
  } catch (error) {
    console.error('Session creation error:', error);
    res.status(500).json({
      error: 'Failed to create chat session',
      details: error.message
    });
  }
});

// Send message
router.post('/company-message/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { sessionId, text, position } = req.body;

    if (!sessionId || !text || !position) {
      return res.status(400).json({ error: 'SessionId, text and position are required' });
    }

    // Find the active session
    const session = await CompanyChatSession.findOne({
      _id: sessionId,
      status: 'active'
    }).populate('company seeker');

    if (!session) {
      return res.status(404).json({ error: 'Active chat session not found' });
    }

    // Determine sender and receiver based on userId and position
    const sender = userId;
    const receiver = position === 'right' ? session.seeker.userId : session.company.userId;

    const companyMessage = new CompanyMessage({
      sender: sender,
      receiver: receiver,
      text: text,
      position: position,
      type: 'text',
      timestamp: new Date()
    });

    session.messages.push(companyMessage);
    await session.save();

    // Socket.IO emission if available
    if (req.app.get('io')) {
      req.app.get('io').to(session._id.toString()).emit('message', companyMessage);
    }

    res.status(201).json(companyMessage);
  } catch (error) {
    console.error('Message sending error:', error);
    res.status(500).json({
      error: 'Failed to send message',
      details: error.message
    });
  }
});

// Get chat history
router.get('/company-history/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId || userId === 'undefined') {
      return res.status(400).json({ error: 'Valid user ID required' });
    }

    const user = await User.findOne({ userId: userId });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const companySessions = await CompanyChatSession.find({
      $or: [
        { company: user._id },
        { seeker: user._id }
      ]
    }).populate('company seeker messages');

    res.json(companySessions);
  } catch (error) {
    console.error('History fetch error:', error);
    res.status(500).json({
      error: 'Failed to fetch chat history',
      details: error.message
    });
  }
});

// End chat session
router.put('/company-session/:userId/:sessionId/end', async (req, res) => {
  try {
    const { userId, sessionId } = req.params;

    if (!sessionId || sessionId === 'undefined') {
      return res.status(400).json({ error: 'Valid session ID required' });
    }

    const session = await CompanyChatSession.findById(sessionId);
    if (!session) {
      return res.status(404).json({ error: 'Chat session not found' });
    }

    // Verify the user is part of this session
    const user = await User.findOne({ userId: userId });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (session.company.toString() !== user._id.toString() && 
        session.seeker.toString() !== user._id.toString()) {
      return res.status(403).json({ error: 'User not authorized to end this session' });
    }

    session.endTime = new Date();
    session.duration = (session.endTime - session.startTime) / 1000;
    session.status = 'completed';
    
    await session.save();
    res.json(session);
  } catch (error) {
    console.error('Session end error:', error);
    res.status(500).json({
      error: 'Failed to end chat session',
      details: error.message
    });
  }
});

module.exports = router;