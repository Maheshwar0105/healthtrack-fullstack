import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { Server } from "socket.io";

import { createServer } from 'http';
import connectDB from './config/db.js';
import { initializeSocket } from './socket.js';

import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import entryRoutes from './routes/entries.js';
import goalRoutes from './routes/goals.js';
import dashboardRoutes from './routes/dashboard.js';
import trackingRoutes from './routes/tracking.js';

dotenv.config();

connectDB();

const app = express();
const server = createServer(app);

// Initialize Socket.io if enabled
if (process.env.ENABLE_SOCKETIO === 'true') {
  initializeSocket(server);
  console.log('Socket.io enabled');
}

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/entries', entryRoutes);
app.use('/api/goals', goalRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/track', trackingRoutes);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
