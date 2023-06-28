const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const http = require("http").Server(app);
const io = require("socket.io")(http, {
  cors: {
    origin: [
      "https://socksonbots.de",
      "https://vueonbots.onrender.com",
      "http://192.168.178.20:5173",
      "http://localhost:5173",
      "http://192.168.178.96:5173",
    ],
  },
});
const path = require("path");
const { data } = require("autoprefixer");
const roomList = [];

const vuePath = __dirname + "/dist/";

app.use(express.static(vuePath));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.sendFile(path + "index.html");
});

io.on("connection", function (socket) {
  console.log("A user with ID: " + socket.id + " connected");

  socket.on("disconnect", function () {
    console.log("A user with ID: " + socket.id + " disconnected");
  });

  socket.on("foo", (data) => {
    socket.broadcast.emit("foo", data);
    console.log("foo method");
    console.log(data);
  });

  socket.on("directionSelf", (data) => {
    socket.emit("directionSelf.response", data.directionSelf);
    socket.to(data.roomId).emit("direction", data.directionSelf);
    // console.log("directionSelf", data);
  });
  socket.on("direction", (data) => {
    console.log(data.roomId);
    socket.to(data.roomId).emit("direction", data.direction);
    console.log("direction method");
    console.log(data);
  });

  socket.on("playerXY", (data) => {
    socket.to(data.roomId).emit("playerXY", data.playerPosition);
    // console.log("playerPosition method");
  });

  socket.on("selectedLevel", (data) => {
    socket.to(data.roomId).emit("selectedLevel.response", data.level);
    socket.emit("selectedLevel.response", data.level);
  });

  socket.on("playGame", (data, callback) => {
    console.log("playGame", data);
    socket.to(data.roomId).emit("playGame.response", data.playGame);
    socket.emit("playGame.response", data.playGame);
    callback({
      status: "ok",
    });
  });

  socket.on("leaveRoom", (roomId) => {
    socket.leave(roomId);
    socket.to(roomId).emit("leaveRoom.info");
    console.log("after leave Rooms:", socket.rooms);
  });

  socket.on("connectRoom", (newRoom) => {
    //TODO Check, if room < 2, then join
    //TODO Check if room exist
    socket.join(newRoom);

    if (!roomList.includes(newRoom)) {
      roomList.push(newRoom);
    }

    console.log(roomList);

    socket.emit("joinedRoom", newRoom);
    socket
      .to(newRoom)
      .emit("chatMessage", "User joined the room at " + printTime());
    console.log(newRoom);
    console.log("Rooms:", socket.rooms);
  });

  socket.on("chat", (data) => {
    console.log(data);
    console.log(data.roomId);
    console.log(data.msg);
    socket.to(data.roomId).emit("chatMessage", data.msg);
    console.log(socket.rooms);
  });

  socket.on("listRooms", () => {
    // console.log(roomList);
    socket.emit("listRooms.response", roomList);
  });
});

function printTime() {
  return new Date().toLocaleTimeString("DE-de");
}

http.listen(3010, () => {
  console.log("Listening on port *: 3010");
});
