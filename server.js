const app = require("express")();
const http = require("http").Server(app);
const io = require("socket.io")(http,{
    cors: {
        origin: ["https://socksonbots.de", "https://vueonbots.onrender.com", "http://192.168.178.20:5173", "http://localhost:5173", "https://home-5013443700.app-ionos.space"]
    }
});
const path = require("path");
const { data } = require("autoprefixer");
const roomList = [
  { name: "Room1", connects: 0 },
  { name: "Room2", connects: 0 },
  { name: "Room3", connects: 0 },
  { name: "Room4", connects: 0 },
  { name: "Room5", connects: 0 },
  { name: "Room6", connects: 0 },
  { name: "Room7", connects: 0 },
  { name: "Room8", connects: 0 },
  { name: "Room9", connects: 0 },
  { name: "Room10", connects: 0 },
];
app.get("/", (req, res) => {
  res.send("<h1>Server running</h1>");
});

io.on("connection", function (socket) {
  console.log("A user with ID: " + socket.id + " connected");

  socket.on("disconnect", function () {

    console.log("A user with ID: " + socket.id + " disconnected");
  });

  console.log("=>(server.js:40) io.rooms", io.sockets.adapter.rooms);

  socket.on("foo", (data) => {
    socket.broadcast.emit("foo", data);
    console.log("foo method");
    console.log(data);
  });

  socket.on("directionSelf", (data) => {
    socket.emit("directionSelf.response", data.directionSelf);
    socket.to(data.roomId).emit("direction", data.directionSelf);
    // console.log("directionSelf", data.directionSelf.up);
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
    roomList.forEach((room) => {
      if (room.name === roomId) {
        socket.leave(roomId);
        // room.connects--;
      }
    });
    socket.to(roomId).emit("leaveRoom.info");
    console.log("after leave Rooms:", socket.rooms);
  });

  socket.on("connectRoom", (newRoomConnect) => {
    //TODO Check, if room < 2, then join
    //TODO Check if room exist
    console.log("=>(server.js:40) io.rooms", io.sockets.adapter.rooms);

    console.log("=>(server.js:42) io.rooms", io.sockets.adapter.rooms.get(newRoomConnect));
    console.log("=>(server.js:42) io.rooms", io.sockets.adapter.rooms.get(newRoomConnect)?.size);

    for (let i = 0; i < roomList.length; i++) {
      if (roomList[i].name === newRoomConnect) {
        if (io.sockets.adapter.rooms.get(newRoomConnect)?.size < 2 || !io.sockets.adapter.rooms.get(newRoomConnect)?.size) {
          socket.join(newRoomConnect);
          console.log("=>(server.js:40) io.rooms", io.sockets.adapter.rooms);

          roomList[i].connects = io.sockets.adapter.rooms.get(newRoomConnect)?.size;
          socket.emit("joinedRoom", newRoomConnect);
          socket
            .to(newRoomConnect)
            .emit("chatMessage", "User joined the room at " + printTime());
          console.log(newRoomConnect);
          console.log("Rooms client is in:", socket.rooms);
        } // TODO else emit room voll
        else {
          socket.emit("connectRoom.error", "Room at max size")
        }
        break;
      }
    }

    console.log(roomList);
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
