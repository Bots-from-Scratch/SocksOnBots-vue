const app = require("express")();
const http = require("http").Server(app);
const io = require("socket.io")(http,{
    cors: {
        origin: ["https://socksonbots.de", "https://vueonbots.onrender.com", "http://192.168.178.20:5173", "http://localhost:5173", "http://192.168.178.96:5173"]
    }
});
// const path = require("path");

app.get("/", (req, res) => {
    res.send("<h1>Server running</h1>");
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
        socket.emit("directionSelf.response", data);
        console.log("directionSelf",data);
    });

    socket.on("playerXY", (data) => {
        socket.broadcast.emit("playerXY", data);
        console.log("playerXY method");
    });

});

http.listen(3010, () => {
    console.log("Listening on port *: 3010");
});
