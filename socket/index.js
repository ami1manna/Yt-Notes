// index.js

const express = require('express');
const http = require('http');
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

// Initialize Socket.IO with CORS configuration
const io = new Server(server, {
  cors: {
    origin: "*", // IMPORTANT: For production, change this to your Vercel frontend URL
    methods: ["GET", "POST"]
  }
});


 
// This block runs every time a new client connects to our server
io.on('connection', (socket) => {
  console.log('✅ A user connected:', socket.id);

  // Listen for a custom event named 'message' from a client
  socket.on('message', (data) => {
    console.log(`Received message from ${socket.id}: ${data}`);

    // Broadcast the received message to all connected clients
    io.emit('message', data);
  });

  // This block runs when that specific client disconnects
  socket.on('disconnect', () => {
    console.log('❌ A user disconnected:', socket.id);
  });
});
 
const PORT = 3001; 
server.listen(PORT, () => {
  console.log(`Real-time server is running on port ${PORT}`);
});