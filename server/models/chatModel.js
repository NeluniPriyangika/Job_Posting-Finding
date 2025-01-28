const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  text: { type: String, required: true },
  type: { type: String, enum: ['text', 'image'], default: 'text' },
  position: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  read: { type: Boolean, default: false }
});

const chatSessionSchema = new mongoose.Schema({
  company: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  seeker: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date },
  duration: { type: Number },
  status: { 
    type: String, 
    enum: ['pending', 'active', 'completed', 'cancelled'],
    default: 'pending' 
  },
  messages: [messageSchema],
  rating: { type: Number, min: 1, max: 5 },
  feedback: { type: String }
});

const ChatSession = mongoose.model('ChatSession', chatSessionSchema);
const Message = mongoose.model('Message', messageSchema);

module.exports = { ChatSession, Message };