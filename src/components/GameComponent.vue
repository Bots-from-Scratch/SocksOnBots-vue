<script setup lang="ts">
import BlocklyComponent from "@/components/BlocklyComponent.vue";
import { onMounted, ref, watch } from "vue";
import { toolboxJson } from "@/toolbox_phaser.js";
import { state } from "@/socket";
import RangeSlider from "@/components/RangeSlider.vue";
import Game from "@/components/Game.vue";
import { useLocalStorage } from "@vueuse/core";

const blockly = ref(null);
let workspace = ref();
const playGame = ref(state.playGame);
const game = ref(null);
const selectedLevel = ref("");
// const volume = ref({
//   music: 5,
//   sound: 80,
// });
//
// const store = useLocalStorage("volume", null);
//
// watch(
//   volume,
//   (newValue) => {
//     store.value = JSON.stringify(newValue);
//     playGame.value && game.value.controlSounds(volume);
//   },
//   { deep: true }
// );
//
// onMounted(() => {
//   const savedVolume = JSON.parse(store.value);
//   if (savedVolume) {
//     console.log(
//       "=>(GameComponent.vue:36) savedVolume",
//       savedVolume.music,
//       savedVolume.sound
//     );
//     // TODO fix volume loading from localstorage
//     // volume.value = savedVolume;
//   }
// });

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

function playGamePressed() {
  console.log("=>(GameComponent.vue:70) playGamePressed");
  playGame.value = state.playGame;
  workspace = blockly.value.workspace;
  game.value.run(blockly.value.workspace);
}

function levelSelected(data) {
  selectedLevel.value = data;
}
</script>

<template>
  <div
    class="flex flex-col justify-start items-center xl:items-start my-12 mx-16"
  >
    <Game :playGame="playGame" ref="game" @selectedLevel="levelSelected" />
    <!--      <div class="flex flex-col justify-start">-->
    <!--        <RangeSlider v-model="volume.music" name="Music Volume" />-->
    <!--        <RangeSlider v-model="volume.sound" name="Sound Volume" />-->
    <!--&lt;!&ndash;        <p>{{ "playGame: " + playGame }}</p>&ndash;&gt;-->
    <!--      </div>-->

    <BlocklyComponent
      class="w-full h-96 shrink grow-0"
      id="blockly"
      :options="options"
      :selectedLevel="selectedLevel"
      ref="blockly"
      @playGamePressed="playGamePressed"
    />
  </div>
</template>

<style scoped>
.monitor {
  margin: 2em auto;
  box-shadow: -15px 0 0 0 black, 15px 0 0 0 black, 0 -15px 0 0 black,
    0 15px 0 0 black;
}

.pixel-border-16 {
  box-shadow: -16px 0 0 0 black, 16px 0 0 0 black, 0 -16px 0 0 black,
    0 16px 0 0 black;
}
</style>
