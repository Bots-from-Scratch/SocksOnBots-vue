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
  room: { id: null, connects: 0, rndLvl: null },
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
  levelFinished: { winner: false, loser: false, playerDisconnected: false },
  chat: ""
});

// "undefined" means the URL will be computed from the `window.location` object
const URL =
  process.env.NODE_ENV === "production"
    ? "https://socket-server-3jgo.onrender.com"
    :  "http://localhost:3010";
      //"http://192.168.50.67:3010/";
export const socket = io(URL, {
  autoConnect: true,
});

socket.on("connect", () => {
  state.connected = true;
  state.room.id = null;
  state.room.connects = 0;
});

socket.on("disconnect", () => {
  state.connected = false;
});

socket.on("playerXY", (data) => {
  state.playerPosition = data;
});
socket.on("chatMessage", (data) => {
  state.chat = data;
});

socket.on("joinRoom", (data) => {
  socket.emit("connectRoom", data);
});

socket.on("connectRoom.error", (error) => {
  console.error(error);
});

socket.on("joinedRoom.response", (data) => {
  state.room.id = data.roomId;
  state.room.connects = data.connects;
});

socket.on("playerJoinedRoom.info", (data) => {
  state.room.connects = data;
});

socket.on("leaveRoom.info", (connects) => {
  state.levelFinished.playerDisconnected = true;
  state.room.connects = connects;
});

socket.on("playGame.response", (data) => {
  state.playGame = data;
});

socket.on("levelFinished.response", (data) => {
  if (data.winner) {
    state.levelFinished.winner = true;
  } else {
    state.levelFinished.loser = true;
  }
});

socket.on("nextLevel.response", (rndLvl) => {
  state.room.rndLvl = rndLvl;
});

socket.on("selectedLevel.response", (data) => {
  state.selectedLevel = data;
});
socket.on("directionSelf.response", (data) => {
  state.directionSelf = data;
});
socket.on("direction", (data) => {
  state.direction = data;
});

socket.on("listRooms.response", (data) => {
  state.rooms = data;
});

export function connect() {
  socket.connect();
}

export function disconnect() {
  socket.disconnect();
}

export function connectRoom(roomName) {
  if (!state.room.id) {
    state.room.id = roomName;
    socket.emit("connectRoom", state.room.id);
  } else {
    socket.emit("leaveRoom", state.room.id);
    state.room.id = roomName;
    socket.emit("connectRoom", state.room.id);
  }
}

export function leaveRoom() {
  socket.emit("leaveRoom", state.room.id);
  state.room.id = null;
  state.room.connects = 0;
  state.levelFinished.playerDisconnected = false;
  state.levelFinished.winner = false;
  state.levelFinished.loser = false;
}

export function resetFinishedLevelObject() {
  state.levelFinished.winner = false;
  state.levelFinished.loser = false;
  state.levelFinished.playerDisconnected = false;
}
