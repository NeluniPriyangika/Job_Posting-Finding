const { CompanyMessage, CompanyChatSession } = require('../models/companyChatModel');

const companyChatMiddleware = async (req, res, next) => {
  try {
    const { companySessionId } = req.body;
    
    if (!companySessionId) {
      return res.status(401).json({ error: 'Chat session ID required' });
    }

    const chatSession = await CompanyChatSession.findById(companySessionId);

    if (!chatSession) {
      return res.status(404).json({ error: 'Chat session not found' });
    }

    if (chatSession.status !== 'active') {
      return res.status(403).json({ error: 'Chat session is no longer active' });
    }

    // Add chat session info to request
    req.companySession = chatSession;

    next();
  } catch (err) {
    res.status(401).json({ error: 'Chat session verification failed' });
  }
};

module.exports = companyChatMiddleware;