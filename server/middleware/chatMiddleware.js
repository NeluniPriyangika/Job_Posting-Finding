const { ChatSession } = require('../models/chatModel');

const chatMiddleware = async (req, res, next) => {
  try {
    const { sessionId } = req.body;
    const userId = req.params.userId;

    if (!sessionId || !userId) {
      return res.status(400).json({ error: 'Session ID and User ID required' });
    }

    const session = await ChatSession.findById(sessionId)
      .populate('company seeker');

    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    if (session.company.userId !== userId && session.seeker.userId !== userId) {
      return res.status(403).json({ error: 'Unauthorized access' });
    }

    req.chatSession = session;
    next();
  } catch (error) {
    res.status(500).json({ error: 'Session verification failed' });
  }
};

module.exports = chatMiddleware;