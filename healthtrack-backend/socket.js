import { Server } from 'socket.io';

let io;

export const initializeSocket = (server) => {
  if (process.env.ENABLE_SOCKETIO !== 'true') {
    return null;
  }

  io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL || 'http://localhost:3000',
      methods: ['GET', 'POST']
    }
  });

  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    socket.on('join-session', (sessionId) => {
      socket.join(`session:${sessionId}`);
      console.log(`Socket ${socket.id} joined session ${sessionId}`);
    });

    socket.on('leave-session', (sessionId) => {
      socket.leave(`session:${sessionId}`);
      console.log(`Socket ${socket.id} left session ${sessionId}`);
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });

  return io;
};

export const emitLocationUpdate = (sessionId, data) => {
  if (io) {
    io.to(`session:${sessionId}`).emit('location-update', data);
  }
};

export default io;

