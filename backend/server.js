import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import authRoutes from './routes/auth.js';
import cookieParser from 'cookie-parser';
import userRoutes from './routes/user.js';
import doctorRoutes from './routes/doctor.js';
import appointmentRoutes from './routes/appointment.js';
import adminRoutes from './routes/admin.js';
import paymentRoutes from './routes/payments.js';
import reportRoutes from './routes/reports.js';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';

// Load environment variables
dotenv.config({ path: './config.env' });

const app = express();
const httpServer = http.createServer(app);
const io = new SocketIOServer(httpServer, {
  cors: { 
    origin: ['http://localhost:5173', 'http://localhost:5174'], 
    credentials: true 
  }
});

// Middleware
app.use(cors({ 
  origin: ['http://localhost:5173', 'http://localhost:5174'], 
  credentials: true 
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Database connection with improved configuration
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
      maxPoolSize: 10, // Maintain up to 10 socket connections
      minPoolSize: 5, // Maintain a minimum of 5 socket connections
      maxIdleTimeMS: 30000, // Close connections after 30 seconds of inactivity
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    
    // Handle connection errors after initial connection
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected. Attempting to reconnect...');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('MongoDB reconnected');
    });

  } catch (error) {
    console.error('MongoDB connection failed:', error);
    
    // If local MongoDB fails, try to provide helpful error message
    if (error.message.includes('ECONNREFUSED')) {
      console.log('\n❌ Local MongoDB connection failed!');
      console.log('📋 To fix this, you have two options:');
      console.log('\n1. Start local MongoDB:');
      console.log('   - Install MongoDB from https://www.mongodb.com/try/download/community');
      console.log('   - Start MongoDB service: mongod');
      console.log('\n2. Use MongoDB Atlas (recommended):');
      console.log('   - Create a free cluster at https://cloud.mongodb.com');
      console.log('   - Update MONGODB_URI in config.env with your Atlas connection string');
      console.log('\n⏳ Retrying connection in 5 seconds...');
      
      // Retry connection after 5 seconds
      setTimeout(() => {
        console.log('🔄 Retrying MongoDB connection...');
        connectDB();
      }, 5000);
    } else {
      // For other errors, exit the process
      process.exit(1);
    }
  }
};

// Configure mongoose settings
mongoose.set('bufferCommands', false); // Disable mongoose buffering

// Connect to database
connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/reports', reportRoutes);
app.use('/uploads', express.static('uploads'));

// Health check endpoint
app.get('/api/health', async (req, res) => {
  const health = {
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    mongodb: {
      status: 'unknown',
      message: ''
    }
  };

  // Check MongoDB connection
  try {
    if (mongoose.connection.readyState === 1) {
      // Try a simple ping operation
      await mongoose.connection.db.admin().ping();
      health.mongodb.status = 'connected';
      health.mongodb.message = 'MongoDB connection is healthy';
    } else {
      health.mongodb.status = 'disconnected';
      health.mongodb.message = 'MongoDB is not connected';
      health.status = 'DEGRADED';
    }
  } catch (error) {
    health.mongodb.status = 'error';
    health.mongodb.message = `MongoDB error: ${error.message}`;
    health.status = 'DEGRADED';
  }

  res.json({
    message: 'Server is running successfully!',
    ...health
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;

// Simple signaling namespace for chat/video
io.on('connection', (socket) => {
  // Join a room per appointment or doctor-patient pair
  socket.on('join_room', (roomId) => {
    socket.join(roomId);
  });

  // Chat messages
  socket.on('chat_message', ({ roomId, message, sender }) => {
    io.to(roomId).emit('chat_message', { message, sender, timestamp: Date.now() });
  });

  // WebRTC signaling
  socket.on('webrtc_offer', ({ roomId, sdp }) => {
    socket.to(roomId).emit('webrtc_offer', { sdp });
  });
  socket.on('webrtc_answer', ({ roomId, sdp }) => {
    socket.to(roomId).emit('webrtc_answer', { sdp });
  });
  socket.on('webrtc_ice_candidate', ({ roomId, candidate }) => {
    socket.to(roomId).emit('webrtc_ice_candidate', { candidate });
  });
});

httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
