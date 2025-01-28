const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const http = require('http');
const socketIo = require('socket.io');
const authenticateJWT = require('./middleware/authMiddleware');

dotenv.config();

const app = express();
const server = http.createServer(app);

const corsOptions = {
  origin: ['http://localhost:3000', 'https://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true,
  optionsSuccessStatus: 200
};

// Initialize Socket.IO with CORS options
const io = socketIo(server, {
  cors: corsOptions
});

// Apply CORS middleware
app.use(cors(corsOptions));

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Add this to your server.js before your routes
app.use((req, res, next) => {
  res.setHeader('Content-Type', 'application/json');
  next();
});

// Store io instance on app
app.set('io', io);

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));

// Serve uploaded files
app.use('/uploads', express.static('uploads'));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  serverSelectionTimeoutMS: 50000,
})
.then(() => console.log('Connected to MongoDB'))
.catch((err) => console.error('MongoDB connection error:', err));

// Enhanced Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Handle joining both company and seeker chat rooms
  socket.on('join', (sessionId) => {
    socket.join(sessionId);
    console.log(`Socket ${socket.id} joined session ${sessionId}`);
  });

  socket.on('typing', (data) => {
    socket.to(data.sessionId).emit('typing', data.user);
  });

  socket.on('stopTyping', (data) => {
    socket.to(data.sessionId).emit('stopTyping', data.user);
  });

  // Handle messages for both company and seeker chats
  socket.on('message', async (data) => {
    try {
      const { sessionId, message } = data;
      io.to(sessionId).emit('message', message);
    } catch (error) {
      console.error('Socket message error:', error);
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Import routes
const authRoutes = require('./routes/auth');
const fbAuthRoutes = require('./routes/fb-auth');
const profileUpdateRoutes = require('./routes/profileupdate');
const seekerProfileUpdateRoutes = require('./routes/seekerprofileupdate');
const chatRoutes = require('./routes/chatRoutes');
//const companyChatRoutes = require('./routes/adviorChatRoute');
//const seekerChatRoutes = require('./routes/seekerChatRoute');
const companyProfileRoutes = require('./routes/companyprofile');
const seekerProfileRoutes = require('./routes/seekerprofile');
const companyRoutes = require('./routes/getCompanies');

// Apply routes
app.use('/api/auth', authRoutes);
app.use('/api/auth', fbAuthRoutes);
app.use('/api', profileUpdateRoutes);
app.use('/api', seekerProfileUpdateRoutes);
app.use('/api/chat', chatRoutes); // Changed to /api/chat for consistency
//app.use('/api/company-chat', companyChatRoutes); // Changed to /api/company-chat
//app.use('/api/seeker-chat', seekerChatRoutes); // Add this line
app.use('/api', companyProfileRoutes);
app.use('/api', seekerProfileRoutes);
app.use('/api', companyRoutes);


// Protected route example
app.get('/protected', authenticateJWT, (req, res) => {
  res.send(`Hello ${req.user.email}, this is a protected route.`);
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Something went wrong!'
  });
});

const PORT = process.env.PORT || 5000;

// Use server.listen instead of app.listen
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));