import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"],
  },
});

export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

const userSocketMap = {}; // {userId: socketId}
const roomUsers = new Map(); // Add roomUsers initialization

io.on("connection", (socket) => {
  console.log("A user connected", socket.id);

  const userId = socket.handshake.query.userId;
  if (userId) userSocketMap[userId] = socket.id;

  socket.on('joinRoom', ({ roomId, userId }) => {
    socket.join(roomId);
    if (!roomUsers.has(roomId)) {
      roomUsers.set(roomId, new Set());
    }
    roomUsers.get(roomId).add(userId);
    console.log(`User ${userId} joined room ${roomId}`);
  });

  socket.on('roomMessage', (messageData) => {
    console.log('Room message received:', messageData);
    io.to(messageData.roomId).emit('roomMessage', messageData);
  });

  socket.on('leaveRoom', ({ roomId, userId }) => {
    socket.leave(roomId);
    if (roomUsers.has(roomId)) {
      roomUsers.get(roomId).delete(userId);
      if (roomUsers.get(roomId).size === 0) {
        roomUsers.delete(roomId);
      }
    }
    console.log(`User ${userId} left room ${roomId}`);
  });

  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    console.log("A user disconnected", socket.id);
    if (userId) {
      roomUsers.forEach((users, roomId) => {
        if (users.has(userId)) {
          users.delete(userId);
          if (users.size === 0) {
            roomUsers.delete(roomId);
          }
        }
      });
      delete userSocketMap[userId];
      io.emit("getOnlineUsers", Object.keys(userSocketMap));
    }
  });
});

export { io, app, server };