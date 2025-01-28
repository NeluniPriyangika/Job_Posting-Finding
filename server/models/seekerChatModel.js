const mongoose = require('mongoose');

const seekermessageSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  text: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  position: { type: String, enum: ['left', 'right'], required: true },
  type: { type: String, default: 'text' }
});

const seekerchatSessionSchema = new mongoose.Schema({
  company: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  seeker: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  startTime: { type: Date, default: Date.now },
  endTime: { type: Date },
  duration: { type: Number }, // in seconds
  messages: [seekermessageSchema],
  status: { type: String, enum: ['active', 'completed'], default: 'active' }
});

const SeekerMessage = mongoose.model('SeekerMessage', seekermessageSchema);
const SeekerChatSession = mongoose.model('SeekerChatSession', seekerchatSessionSchema);

module.exports = { SeekerMessage, SeekerChatSession };