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
  rooms: [],
  selectedLevel: 0,
  activeScene: ""
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
  state.roomID = data;
});

socket.on("leaveRoom.info", () => console.log("Player left the room"));

socket.on("playGame.response", (data) => {
  console.log("playGame.response", data);
  state.playGame = data;
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
  // console.log(state.rooms);
  state.rooms = data;
});

export function connect() {
  socket.connect();
}

export function disconnect() {
  socket.disconnect();
}

export function connectRoom(roomName) {
  if (state.roomID) {
    console.log("disconnected from Room", state.roomID);
    socket.emit("leaveRoom", state.roomID);
    state.roomID = "";
  }

  if (!state.roomID) {
    state.roomID = roomName;
    socket.emit("connectRoom", state.roomID);
    console.log("connected to Room", state.roomID);
  }
}
