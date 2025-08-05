const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const registerSocketHandlers = require("./socket");

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("✅ Connected:", socket.id);
  registerSocketHandlers(io, socket);
});

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
