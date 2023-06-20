import { reactive } from "vue";
import { io } from "socket.io-client";

export const state = reactive({
  connected: false,
  playGame: false,
  playerXY: {},
  directionSelf: {},
  directionOpponent: {},
});

// "undefined" means the URL will be computed from the `window.location` object
const URL =
  process.env.NODE_ENV === "production"
    ? "https://socket-server-3jgo.onrender.com"
    : "localhost:3010";
// : ["http://192.168.178.20:3010", "http://192.168.178.96:3010", "localhost:3010"];

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
  // console.log("playerXY");
  state.playerXY = data;
  // state.fooEvents.push(args);
});

socket.on("playGame.response", (data) => {
  console.log("playGame.response", data)
  state.playGame = data
});
socket.on("directionSelf.response", (data) => {
  // console.log("direction");
  state.directionSelf = data;
  // console.log("state.directionSelf", state.directionSelf)
});
