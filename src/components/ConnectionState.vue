<template>
  <p>State: {{ connected }}</p>
  <p>foo: {{ fooEvents }}</p>
  <p>direction: {{ direction }}</p>

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
    },
    direction() {
      return state.direction;
    }
  }
}
</script>

