import { reactive } from "vue";
import { io } from "socket.io-client";

export const state = reactive({
  connected: false,
  playGame: false,
  playerPosition: {},
  directionSelf: {},
  directionOpponent: {},
  direction: {},
  roomID: "",
  room: { id: null, connects: 0 },
  rooms: [],
  selectedLevel: {
    number: 2,
    name: "Level 3",
    x: 3,
    y: 2,
    isActive: false,
    playerStart: { x: 3, y: 7 },
  },
  activeScene: "",
  levelFinished: { winner: false, loser: false },
});

// "undefined" means the URL will be computed from the `window.location` object
const URL =
  process.env.NODE_ENV === "production"
    ? "https://socket-server-3jgo.onrender.com"
    : "http://localhost:3010";

export const socket = io(URL, {
  autoConnect: true,
});

socket.on("connect", () => {
  console.log("connectMethod");
  state.connected = true;
});

socket.on("disconnect", () => {
  state.connected = false;
});

socket.on("playerXY", (data) => {
  // console.log("playerXY", data);
  state.playerPosition = data;
  // state.fooEvents.push(args);
});
socket.on("chatMessage", (data) => {
  console.log(data);
});

socket.on("joinRoom", (data) => {
  socket.emit("connectRoom", data);
});

socket.on("connectRoom.error", (error) => {
  console.log(error);
});

socket.on("joinedRoom", (data) => {
  state.room.id = data;
});

socket.on("leaveRoom.info", () => console.log("Player left the room"));

socket.on("playGame.response", (data) => {
  console.log("playGame.response", data);
  state.playGame = data;
});

socket.on("levelFinished.response", (data) => {
  console.log("socket", data.text);
  if (data.winner) {
    state.levelFinished.winner = true;
  } else {
    state.levelFinished.loser = true;
  }
});

socket.on("selectedLevel.response", (data) => {
  state.selectedLevel = data;
});
socket.on("directionSelf.response", (data) => {
  state.directionSelf = data;
  // console.log("state.directionSelf", state.directionSelf)
});
socket.on("direction", (data) => {
  // console.log("direction", data);
  state.direction = data;
});

socket.on("listRooms.response", (data) => {
  state.rooms = data;
  console.log("state.rooms", state.rooms);
});

export function connect() {
  socket.connect();
}

export function disconnect() {
  socket.disconnect();
}

// export function connectRoom(roomName) {
//   if (state.roomID) {
//     console.log("disconnected from Room", state.roomID);
//     socket.emit("leaveRoom", state.roomID);
//     state.roomID = "";
//   }
//
//   if (!state.roomID) {
//     state.roomID = roomName;
//     socket.emit("connectRoom", state.roomID);
//     console.log("connected to Room", state.roomID);
//   }
// }

export function connectRoom(roomName) {
  if (!state.room.id) {
    state.room.id = roomName;
    socket.emit("connectRoom", state.room.id);
    console.log("connected to Room", state.room.id);
  } else {
    socket.emit("leaveRoom", state.room.id);
    state.room.id = roomName;
    socket.emit("connectRoom", state.room.id);
  }
}

export function leaveRoom() {
  socket.emit("leaveRoom", state.room.id);
  state.room.id = null;
}
