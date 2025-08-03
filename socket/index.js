const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // In production, specify your frontend URL
    methods: ["GET", "POST"],
  },
});

const roomUsers = {}; // { roomId: Set(socketId) }

io.on("connection", (socket) => {
  console.log("🔌 New client connected:", socket.id);

  socket.on("join_room", ({ groupId, playlistId, user }) => {
    const roomId = `${groupId}-${playlistId}`;

    socket.join(roomId);

    if (!roomUsers[roomId]) roomUsers[roomId] = new Map();
    roomUsers[roomId].set(socket.id, user);

    console.log(`✅ ${user.name} joined room: ${roomId}`);

    io.to(roomId).emit("room_users", Array.from(roomUsers[roomId].values()));
  });

  socket.on("disconnect", () => {
    for (const [roomId, users] of Object.entries(roomUsers)) {
      if (users.has(socket.id)) {
        const user = users.get(socket.id);
        users.delete(socket.id);
        console.log(`❌ ${user.name} disconnected from ${roomId}`);

        io.to(roomId).emit("room_users", Array.from(users.values()));

        if (users.size === 0) {
          delete roomUsers[roomId];
        }
        break;
      }
    }
  });
});

server.listen(5001, () => {
  console.log("🚀 Server running on http://localhost:5001");
});
