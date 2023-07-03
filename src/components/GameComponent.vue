<script setup lang="ts">
import BlocklyComponent from "@/components/BlocklyComponent.vue";
import { onMounted, ref, watch } from "vue";
import { toolboxJson } from "@/toolbox_phaser.js";
import { state } from "@/socket";
import RangeSlider from "@/components/RangeSlider.vue";
import Game from "@/components/Game.vue";
import { useLocalStorage } from "@vueuse/core";

const blockly = ref(null);
let blocklyWorkspace = ref();
const playGame = ref(state.playGame);
const game = ref(null);
const selectedLevel = ref("");

const blocklyOptions = {
  toolbox: toolboxJson,
  collapse: true,
  comments: true,
  disable: true,
  maxBlocks: Infinity,
  trashcan: true,
  horizontalLayout: false,
  toolboxPosition: "start",
  css: true,
  media: "https://blockly-demo.appspot.com/static/media/",
  rtl: false,
  scrollbars: true,
  sounds: true,
  oneBasedIndex: true,
  grid: {
    spacing: 25,
    length: 3,
    colour: "#ccc",
    snap: true,
  },
};

function sendBlocklyWorkspaceToGame(workspace) {
  blocklyWorkspace.value = workspace;
}

function levelSelected(data) {
  selectedLevel.value = data;
}
</script>

<template>
  <div
    class="flex flex-col justify-start items-center xl:items-start my-12 mx-16"
  >
    <Game
      :playGame="playGame"
      :blocklyWorkspace="blocklyWorkspace"
      ref="game"
      @selectedLevel="levelSelected"
    />

    <BlocklyComponent
      class="w-full h-96 shrink grow-0"
      id="blockly"
      :options="blocklyOptions"
      :selectedLevel="selectedLevel"
      ref="blockly"
      @workspaceFromBlockly="sendBlocklyWorkspaceToGame"
    />
  </div>
</template>

<style scoped>
</style>
