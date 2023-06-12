<template>
  <p>State: {{ connected }}</p>
  <p>State: {{ fooEvents }}</p>
</template>

<script>
import { state } from "@/socket";

export default {
  name: "ConnectionState",

  computed: {
    connected() {
      return state.connected;
    },
    fooEvents() {
      return state.fooEvents;
    }
  }
}
</script>

