import { reactive } from "vue";
import { io } from "socket.io-client";

export const state = reactive({
  connected: false,
  playerXY: {},
  direction: {}
});

// "undefined" means the URL will be computed from the `window.location` object
const URL =
  process.env.NODE_ENV === "production" ? "https://socket-server-3jgo.onrender.com" : "http://localhost:3010";

export const socket = io(URL, {
  autoConnect: true,
});

socket.on("connect", () => {
  console.log("connectMethod")
  state.connected = true;
});

socket.on("disconnect", () => {
  state.connected = false;
});

socket.on("playerXY", (data) => {
  console.log("playerXY");
  state.playerXY = data;
  // state.fooEvents.push(args);
});

socket.on("direction", (data) => {
  console.log("direction");
  state.direction = data;
});

