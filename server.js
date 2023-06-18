const app = require("express")();
const http = require("http").Server(app);
const io = require("socket.io")(http, {
  cors: {
    origin: "http://localhost:5173",
  },
});
const path = require("path");
const roomList = [];

app.get("/", (req, res) => {
  res.send("<h1>Server running</h1>");
});

io.on("connection", function (socket) {
  console.log("A user with ID: " + socket.id + " connected");
  // console.log(socket);

  // setInterval((socket) => {
  //   socket.broadcast(socket);
  // }, 1000);
  // socket.join("r_" + socket.id);

  socket.on("disconnect", function () {
    console.log("A user with ID: " + socket.id + " disconnected");
  });

  socket.on("foo", (data) => {
    socket.broadcast.emit("foo was clicked by one player", data);
    console.log("foo on server on " + printTime());
    console.log(data);
  });

  socket.on("direction", (data) => {
    socket.emit("direction", data);
    console.log("direction method");
    console.log(data);
  });

  socket.on("playerX", (data) => {
    // socket.emit("direction", data);
    console.log("playerX method by " + data);
    console.log(data);
  });

  socket.on("connectRoom", (data) => {
    // Check, if room < 2, then join
    socket.join("r_" + data);
    roomList.push("r_" + data);
    console.log(roomList);
    socket
      .to("r_" + data)
      .emit("chatMessage", "This is a message on " + printTime());
    console.log(data);
    console.log("Rooms:", socket.rooms);
  });

  socket.on("chat", (data) => {
    console.log(data);
    console.log(data.roomId);
    console.log(data.msg);
    socket.to("r_" + data.roomId).emit("chatMessage", data.msg);
    console.log(socket.rooms);
  });

  socket.on("listRooms", () => {
    console.log("Aufruf");
    // console.log(socket);
    // socket.to("r_" + socket.roomId).emit("chatMessage", socket.msg);
    console.log(roomList);
    socket.emit("listRooms.response", roomList);
  });

  // socket.on("listRooms", () => {
  //   const roomList = socket.rooms;
  //   console.log(roomList);
  //   socket.emit("listRooms.response", roomList);
  // });
});

function printTime() {
  return new Date().toLocaleTimeString("DE-de");
}

http.listen(3010, () => {
  console.log("Listening on port *: 3010");
});
