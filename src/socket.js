import { reactive } from "vue";
import { io } from "socket.io-client";

export const state = reactive({
  connected: false,
  fooEvents: [],
  direction: {},
  roomID: "",
});

// "undefined" means the URL will be computed from the `window.location` object
const URL =
  process.env.NODE_ENV === "production" ? undefined : "http://localhost:3010";

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

socket.on("foo", (data) => {
  console.log("foo");
  state.fooEvents.push(data);
  // state.fooEvents.push(args);
});
socket.on("chatMessage", (data) => {
  console.log("Chat:", data);
});

socket.on("joinRoom", (data) => {
  socket.emit("connectRoom", data);
});

socket.on("joinedRoom", (data) => {
  state.roomID = data;
});

socket.on("direction", (data) => {
  console.log("direction");
  state.direction = data.direction;
});

socket.on("listRooms.response", (data) => {
  console.log(data);
});
