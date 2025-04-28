import { Server } from 'socket.io';
import { createServer } from 'node:http';
import express from 'express';

const app = express();
const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

const userSocketMap: { [key: string]: string } = {};

export const getReceiverSocketId = (receiverId: string) => {
  return userSocketMap[receiverId];
};

io.on('connection', (socket) => {
  console.log('socket connected', socket.id);

  const userId = socket.handshake.query.userId as string;

  io.emit('getOnlineUsers', Object.keys(userSocketMap));

  socket.on('disconnect', () => {
    console.log('socket disconnected', socket.id);
    delete userSocketMap[userId];
    io.emit('getOnlineUsers', Object.keys(userSocketMap));
  });
});

export { server, app, io };
