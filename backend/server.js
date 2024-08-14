const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const socketFunctions = require("./socket");
const authRouter = require("./auth"); 
const path = require("path");
const app = express();
app.use(cors());
app.use(express.json());

const publicDirectoryPath = path.join(__dirname, "Images");
app.use("/Images", express.static(publicDirectoryPath));
app.use("/auth", authRouter);
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});
socketFunctions(io);
app.listen(8080, () => {
  console.log("Listening on port 8080");
});
server.listen(3001, () => {
  console.log("Server listening on port 3001");
});
