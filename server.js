const app = require("express")();
const http = require("http").Server(app);
const io = require("socket.io")(http, {
  cors: {
    origin: "http://localhost:5173",
  },
});
const path = require("path");

app.get("/", (req, res) => {
  res.send("<h1>Server running</h1>");
});

io.on("connection", function (socket) {
  console.log("A user with ID: " + socket.id + " connected");
  socket.join("r_" + socket.id);

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
    socket.join("r_" + data);
    socket.to(data).emit("lobbyChat", "This is a message on " + printTime());
    console.log(data);
  });
});

io.on("chat", (socket) => {
  console.log(socket);
  socket.to("r_" + socket.roomId).emit("chatMessage", socket.msg);
});

function printTime() {
  return new Date().toLocaleTimeString("DE-de");
}

http.listen(3010, () => {
  console.log("Listening on port *: 3010");
});
