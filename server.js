const app = require("express")();
const http = require("http").Server(app);
const io = require("socket.io")(http,{
    cors: {
        origin: ["https://socksonbots.de", "https://vueonbots.onrender.com", "http://192.168.178.20:5173", "http://localhost:5173", "https://home-5013443700.app-ionos.space"]
    }
});
const path = require("path");
const { data } = require("autoprefixer");
const levelTutorial = require(path.join(__dirname, "lvl-tut.json"));
const levelsMultiplayer = require(path.join(
  __dirname,
  "src/game/levelsMultiplayer.json"
));

const roomList = [
  { id: 1, name: "Room1", connects: 0, nextLvlCounter: 0 },
  { id: 2, name: "Room2", connects: 0, nextLvlCounter: 0 },
  { id: 3, name: "Room3", connects: 0, nextLvlCounter: 0 },
  { id: 4, name: "Room4", connects: 0, nextLvlCounter: 0 },
  { id: 5, name: "Room5", connects: 0, nextLvlCounter: 0 },
  { id: 6, name: "Room6", connects: 0, nextLvlCounter: 0 },
  { id: 7, name: "Room7", connects: 0, nextLvlCounter: 0 },
  { id: 8, name: "Room8", connects: 0, nextLvlCounter: 0 },
];


app.get("/", (req, res) => {
  res.send("<h1>Server running</h1>");
});

app.get("/level-tut", (req, res) => {
  res.json(getRandomLevel(levelTutorial));
});

function emitRandomLevel(roomId) {
  roomList[roomId - 1].nextLvlCounter++;
  if (roomList[roomId - 1].nextLvlCounter === 2) {
    const rndLvl = getRandomLevel(levelsMultiplayer);
    io.in(roomId).emit("nextLevel.response", rndLvl);
    roomList[roomId - 1].nextLvlCounter = 0;
  }
}

io.on("connection", function (socket) {
  console.log("A user with ID: " + socket.id + " connected");

  socket.on("disconnect", function () {
    console.log("A user with ID: " + socket.id + " disconnected");
    updateRoomList();
    if (
      socket.roomId &&
      io.sockets.adapter.rooms.get(socket.roomId)?.size > 0
    ) {
      socket
        .to(socket.roomId)
        .emit(
          "leaveRoom.info",
          io.sockets.adapter.rooms.get(socket.roomId)?.size
        );
    }
    console.log("after disconnect roomList", roomList);
  });
  // console.log("=>(server.js:40) io.rooms", io.sockets.adapter.rooms);

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
    console.log("=>(server.js:106) leaveRoom roomId", roomId);
    socket.leave(roomId);
    if (io.sockets.adapter.rooms.get(roomId)?.size > 0) {
      socket
        .to(roomId)
        .emit("leaveRoom.info", io.sockets.adapter.rooms.get(roomId).size);
    }
    console.log(
      "=>(server.js:40)after leave io.rooms",
      io.sockets.adapter.rooms
    );

    // room.connects--;
    updateRoomList();

    console.log("=>(server.js:93)after leave roomList", roomList);

    console.log("after leave Rooms:", socket.rooms);
  });

  socket.on("connectRoom", (newRoomConnect) => {
    //TODO Check, if room < 2, then join
    //TODO Check if room exist
    console.log("=>(server.js:103) newRoomConnect", newRoomConnect);
    // console.log("=>(server.js:40) io.rooms", io.sockets.adapter.rooms);

    console.log(
      "=>(server.js:42) io.rooms",
      io.sockets.adapter.rooms.get(newRoomConnect)
    );
    console.log(
      "=>(server.js:42) io.rooms",
      io.sockets.adapter.rooms.get(newRoomConnect)?.size
    );

    for (let i = 0; i < roomList.length; i++) {
      if (roomList[i].id === newRoomConnect) {
        if (
          io.sockets.adapter.rooms.get(newRoomConnect)?.size < 2 ||
          !io.sockets.adapter.rooms.get(newRoomConnect)?.size
        ) {
          socket.join(newRoomConnect);
          emitRandomLevel(newRoomConnect);

          socket.roomId = newRoomConnect;
          console.log("=>(server.js:40) io.rooms", io.sockets.adapter.rooms);

          roomList[i].connects =
            io.sockets.adapter.rooms.get(newRoomConnect)?.size;
          socket.emit("joinedRoom.response", {
            roomId: newRoomConnect,
            connects: roomList[i].connects,
          });
          socket
            .to(newRoomConnect)
            .emit("playerJoinedRoom.info", roomList[i].connects);
          console.log(newRoomConnect);
          console.log("Rooms client is in:", socket.rooms);
        } // TODO else emit room voll
        else {
          socket.emit("connectRoom.error", "Room at max size");
        }
        break;
      }
    }

    console.log(roomList);
  });

  socket.on("levelFinished", (data) => {
    socket.to(data.roomId).emit("levelFinished.response", {
      text: "Du hast verloren",
      winner: false,
    });
    socket.emit("levelFinished.response", {
      text: "Du hast gewonnen",
      winner: true,
    });
  });

  socket.on("nextLevel", (roomId) => {
    emitRandomLevel(roomId);
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

/**
 * Generiert aus einem Array aus JSON-Einträgen eine
 * @param {json} levels Ein Array aus JSONs
 * @returns Eine JSON
 */
function getRandomLevel(levels) {
  let index = Math.floor(Math.random() * levels.length);
  return levels[index];
}

function updateRoomList() {
  roomList.forEach((room) => {
    if (io.sockets.adapter.rooms.get(room.id)) {
      console.log(
        "=>(server.js:99) ",
        io.sockets.adapter.rooms.get(room.id).size
      );
      room.connects = io.sockets.adapter.rooms.get(room.id).size;
    } else {
      room.connects = 0;
    }
  });
}

http.listen(3010, () => {
  console.log("Listening on port *: 3010");
});
