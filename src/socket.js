import { reactive } from "vue";
import { io } from "socket.io-client";

export const state = reactive({
  connected: false,
  fooEvents: [],
  barEvents: [],
});

// "undefined" means the URL will be computed from the `window.location` object
const URL =
  process.env.NODE_ENV === "production" ? undefined : "http://localhost:3010";

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

socket.on("foo", (data) => {
  // state.fooEvents.push(args);
  console.log("foo");
  state.fooEvents.push(data);
});

socket.on("bar", (...args) => {
  state.barEvents.push(args);
});
