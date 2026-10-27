import { io } from 'socket.io-client';

const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || (
  process.env.NODE_ENV === 'production' ? window.location.origin : 'http://localhost:5000'
);

let socket = null;

export const getSocket = () => {
  if (!socket) {
    socket = io(SOCKET_URL, {
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socket.on('connect', () => {
      console.log('🔌 Connected to IMovies Realtime Socket:', socket.id);
    });

    socket.on('disconnect', () => {
      console.log('🔌 Disconnected from socket');
    });
  }
  return socket;
};

export const joinShowRoom = (showId) => {
  const s = getSocket();
  if (s) {
    s.emit('joinShow', showId);
  }
};

export const leaveShowRoom = (showId) => {
  const s = getSocket();
  if (s) {
    s.emit('leaveShow', showId);
  }
};

export default getSocket;
