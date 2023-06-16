<template>
  <div class="flex gap-4">
    <button @click="connect()">Connect</button>
    <button @click="foo()">foo</button>
    <button @click="disconnect()">Disconnect</button>
    <input type="text" name="lobby" id="lobby-id" v-model="room" />
    <button @click="connectRoom(room)">Connect</button>
    <input type="text" name="chat" id="chat" v-model="chat" />
    <button @click="sendMessage(room, chat)">Send</button>
  </div>
</template>

<script>
import { socket } from "@/socket";

export default {
  name: "ConnectionManager",

  data() {
    return {
      test: "testString",
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
    connectRoom(roomId) {
      socket.emit("connectRoom", roomId);
      console.log("connect Room", roomId);
    },

    sendMessage(roomId, text) {
      socket.emit("chat", { roomId: roomId, msg: text });
    },
  },
};
</script>
