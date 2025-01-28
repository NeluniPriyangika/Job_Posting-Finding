const express = require('express');
const router = express.Router();
const { ChatSession, Message } = require('../models/chatModel');
const User = require('../models/user');
const chatMiddleware = require('../middleware/chatMiddleware');

// Initialize chat session
router.post('/session/initialize', async (req, res) => {
  const { companyId, seekerId } = req.body;
  
  try {
    const [company, seeker] = await Promise.all([
      User.findOne({ userId: companyId, userType: 'company' }),
      User.findOne({ userId: seekerId, userType: 'seeker' })
    ]);

    if (!company || !seeker) {
      return res.status(404).json({ error: 'Invalid company or seeker' });
    }

    const activeSession = await ChatSession.findOne({
      company: company._id,
      seeker: seeker._id,
      status: { $in: ['pending', 'active'] }
    });

    if (activeSession) {
      return res.status(400).json({ 
        error: 'Active session exists',
        sessionId: activeSession._id 
      });
    }

    const session = new ChatSession({
      company: company._id,
      seeker: seeker._id,
      startTime: new Date(),
      status: 'pending'
    });

    await session.save();
    
    req.app.get('io').to(company.userId).emit('newSession', {
      sessionId: session._id,
      user: seeker
    });

    res.status(201).json(session);
  } catch (error) {
    res.status(500).json({ error: 'Session creation failed' });
  }
});

// Send message
router.post('/message/:userId', chatMiddleware, async (req, res) => {
  const { sessionId, text, position } = req.body;
  const userId = req.params.userId;

  try {
    const session = req.chatSession;

    if (session.status === 'pending') {
      session.status = 'active';
    }

    const message = new Message({
      sender: userId,
      receiver: position === 'right' ? session.seeker._id : session.company._id,
      text,
      position,
      timestamp: new Date()
    });

    session.messages.push(message);
    await session.save();

    req.app.get('io').to(sessionId).emit('message', message);
    
    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ error: 'Message sending failed' });
  }
});

// Get chat history
router.get('/history/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findOne({ userId });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const sessions = await ChatSession.find({
      $or: [{ company: user._id }, { seeker: user._id }]
    })
    .populate('company seeker messages')
    .sort({ startTime: -1 });

    res.json(sessions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch history' });
  }
});

// End session
router.put('/session/:sessionId/end', chatMiddleware, async (req, res) => {
  try {
    const session = req.chatSession;
    
    session.endTime = new Date();
    session.duration = (session.endTime - session.startTime) / 1000;
    session.status = 'completed';
    
    await session.save();
    
    req.app.get('io').to(session._id).emit('sessionEnded', {
      sessionId: session._id,
      duration: session.duration
    });

    res.json(session);
  } catch (error) {
    res.status(500).json({ error: 'Failed to end session' });
  }
});

module.exports = router;