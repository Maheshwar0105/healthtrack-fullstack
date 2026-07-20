import { io } from 'socket.io-client';

let socket = null;
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 
                   (import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') : 'http://localhost:5000');

export const getSocket = () => {
  if (!socket) {
    console.log(`Connecting to Socket.io server at ${SOCKET_URL}...`);
    
    socket = io(SOCKET_URL, {
      autoConnect: false,
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 20000,
      transports: ['websocket', 'polling']
    });

    socket.on('connect', () => {
      console.log('Socket.io connection established successfully with id:', socket.id);
    });

    socket.on('connect_error', (error) => {
      console.error('Socket.io connection error:', error.message);
    });

    socket.on('disconnect', (reason) => {
      console.warn('Socket.io disconnected:', reason);
    });

    socket.on('reconnect_attempt', (attempt) => {
      console.log(`Socket.io reconnection attempt #${attempt}...`);
    });

    socket.on('reconnect', (attempt) => {
      console.log(`Socket.io reconnected successfully after #${attempt} attempts.`);
    });

    socket.on('reconnect_failed', () => {
      console.error('Socket.io reconnection failed completely.');
    });
  }
  return socket;
};

export const connectSocket = () => {
  const s = getSocket();
  if (s && !s.connected) {
    s.connect();
  }
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
    console.log('Socket.io disconnected and cleared.');
  }
};

// Join a tracking room session
export const joinSession = (sessionId) => {
  const s = getSocket();
  connectSocket();
  if (s) {
    s.emit('join-session', sessionId);
    console.log(`Requested to join socket room session: ${sessionId}`);
  }
};

// Leave a tracking room session
export const leaveSession = (sessionId) => {
  const s = getSocket();
  if (s && s.connected) {
    s.emit('leave-session', sessionId);
    console.log(`Requested to leave socket room session: ${sessionId}`);
  }
};

// Subscribe to location updates
export const subscribeToLocationUpdates = (callback) => {
  const s = getSocket();
  if (s) {
    s.off('location-update'); // Clear previous bindings
    s.on('location-update', (data) => {
      console.log('Received real-time location update:', data);
      callback(data);
    });
  }
};

export default {
  getSocket,
  connectSocket,
  disconnectSocket,
  joinSession,
  leaveSession,
  subscribeToLocationUpdates
};
