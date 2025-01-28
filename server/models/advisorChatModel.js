const mongoose = require('mongoose');

const companymessageSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  text: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  position: { type: String, enum: ['left', 'right'], required: true },
  type: { type: String, default: 'text' }
});

const companychatSessionSchema = new mongoose.Schema({
  company: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  seeker: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  startTime: { type: Date, default: Date.now },
  endTime: { type: Date },
  duration: { type: Number }, // in seconds
  messages: [companymessageSchema],
  status: { type: String, enum: ['active', 'completed'], default: 'active' }
});

const CompanyMessage = mongoose.model('Message', companymessageSchema);
const CompanyChatSession = mongoose.model('ChatSession', companychatSessionSchema);

module.exports = { CompanyMessage, CompanyChatSession };