const app = require("express")();
const http = require("http").Server(app);
const io = require("socket.io")(http,{
    cors: {
        origin: ["https://socksonbots.de", "https://vueonbots.onrender.com", "http://192.168.178.20:5173", "http://localhost:5173"]
    }
});
const path = require("path");
const roomList = [];

app.get("/", (req, res) => {
  res.send("<h1>Server running</h1>");
});

io.on("connection", function (socket) {
  console.log("A user with ID: " + socket.id + " connected");

  socket.on("disconnect", function () {
    console.log("A user with ID: " + socket.id + " disconnected");
  });

  socket.on("foo", (data) => {
    socket.broadcast.emit("foo was clicked by one player", data);
    console.log("foo on server on " + printTime());
    console.log(data);
  });

  socket.on("direction", (data) => {
    socket.to(data.roomID).emit("direction", data.direction);
    console.log("direction method");
    console.log(data);
  });

  socket.on("playerX", (data) => {
    // socket.emit("direction", data);
    console.log("playerX method by " + data);
    console.log(data);
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
      .emit("chatMessage", "This is a message on " + printTime());
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
    console.log(roomList);
    socket.emit("listRooms.response", roomList);
  });
});

function printTime() {
  return new Date().toLocaleTimeString("DE-de");
}

http.listen(3010, () => {
  console.log("Listening on port *: 3010");
});
