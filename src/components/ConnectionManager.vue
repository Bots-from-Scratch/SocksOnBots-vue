<template>
  <div class="flex gap-4">
  <button @click="connect()">Connect</button>
  <button @click="foo()">foo</button>
  <button @click="disconnect()">Disconnect</button>
  </div>
</template>

<script>
import { socket } from "@/socket";

export default {
  name: "ConnectionManager",

  data() {
    return {
      test: "testString"
    }
  },

  methods: {
    connect() {
      socket.connect();
      console.log(socket)
    },
    disconnect() {
      socket.disconnect();
      console.log(socket)

    },
    foo() {
      socket.emit("foo", this.test)
    }
  }
}
</script>
