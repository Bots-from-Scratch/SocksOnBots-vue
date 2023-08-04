<template>
  <div class="flex gap-4">
    <button @click="connect()">Connect</button>
    <button @click="foo()">foo</button>
    <button @click="disconnect()">Disconnect</button>
    <input type="text" name="lobby" id="lobby-id" v-model="roomID" />
    <button @click="connectRoom()">Connect</button>
    <input type="text" name="chat" id="chat" v-model="message" />
    <button @click="sendMessage(message)">Send</button>
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
      roomID: "Room1",
      message: "hey other player",
      connectedToRoom: "",
    };
  },

  methods: {
    connect() {
      socket.connect();
    },
    disconnect() {
      socket.disconnect();
    },
    foo() {
      socket.emit("foo", this.test);
    },
    connectRoom() {
      if (!this.connectedToRoom) {
        this.connectedToRoom = this.roomID;
        socket.emit("connectRoom", this.roomID);
      } else {
        socket.emit("leaveRoom", this.connectedToRoom);
        this.connectedToRoom = this.roomID;
        socket.emit("connectRoom", this.roomID);
      }
    },
    sendMessage(text) {
      if (this.connectedToRoom) {
        socket.emit("chat", { roomId: this.roomID, msg: text });
      }
    },
    startInterval() {
      setInterval(() => socket.emit("listRooms"), 1000);
    },
  },
};
</script>
