<script setup lang="ts">
import Game from "@/components/Game.vue";
import BlocklyComponent from "@/components/BlocklyComponent.vue";
import { computed, onMounted, ref, watch, watchEffect } from "vue";
import { javascriptGenerator } from "blockly/javascript";
import Blockly from "blockly";
import { toolboxJson } from "@/toolbox_phaser.js";
import { state } from "@/socket";
import RangeSlider from "@/components/RangeSlider.vue";
import Level4 from "@/App.vue";
import Test from "@/components/Test.vue";
import { useLocalStorage } from "@vueuse/core";

const blockly = ref(null);
let workspace = ref();
const playGame = ref(state.playGame);
const volume = ref({
  music: 5,
  sound: 5,
});

const store = useLocalStorage("volume", null);

watch(
  volume,
  (newValue) => {
    store.value = JSON.stringify(newValue);
  },
  { deep: true }
);

onMounted(() => {
  const savedVolume = JSON.parse(store.value);
  if (savedVolume) {
    console.log(
      "=>(GameComponent.vue:36) savedVolume",
      savedVolume.music, savedVolume.sound
    );
    // TODO fix volume loading from localstorage
    // volume.value = savedVolume;
  }
});

const options = {
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

function runCodePressed() {
  playGame.value = state.playGame;
  workspace = blockly.value.workspace;
}
</script>

<template>
  <div
    class="flex xl:flex-row flex-col justify-start items-centerr xl:items-start my-24 mx-16"
  >
    <Game :playGame="playGame" :volume="volume" :workspace="workspace" />
    <div class="flex flex-col justify-start">
      <RangeSlider v-model="volume.music" name="Music Volume" />
      <RangeSlider v-model="volume.sound" name="Sound Volume" />
      <p>{{ "playGame: " + playGame }}</p>
    </div>
    <BlocklyComponent
      class="w-full max-w-[960px] xl:max-w-xl h-96 shrink grow-0"
      id="blockly"
      :options="options"
      ref="blockly"
      @runCodePressed="runCodePressed"
    />
  </div>
</template>

<style scoped></style>
