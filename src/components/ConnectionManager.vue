<template>
  <div class="flex gap-4">
    <button @click="connect()">Connect</button>
    <button @click="foo()">foo</button>
    <button @click="disconnect()">Disconnect</button>
    <input type="text" name="lobby" id="lobby-id" v-model="roomID" />
    <button @click="connectRoom()">Connect</button>
    <input type="text" name="chat" id="chat" v-model="chat" />
    <button @click="sendMessage(chat)">Send</button>
  </div>
</template>

<script>
import { socket } from "@/socket";

export default {
  setup() {},

  mounted() {
    this.startInterval();
  },

  name: "ConnectionManager",

  data() {
    return {
      test: "testString",
      roomID: "",
    };
  },

  methods: {
    connect() {
      socket.connect();
      console.log(socket);
    },
    disconnect() {
      socket.disconnect();
      console.log(socket);
    },
    foo() {
      socket.emit("foo", this.test);
    },
    connectRoom() {
      socket.emit("connectRoom", this.roomID);
      console.log(this.roomID);
      console.log("connect Room", this.roomID);
    },
    sendMessage(text) {
      socket.emit("chat", { roomId: this.roomID, msg: text });
      console.log("chat", this.roomID, text);
    },
    startInterval() {
      setInterval(() => socket.emit("listRooms"), 1000);
    },
  },
};
</script>
