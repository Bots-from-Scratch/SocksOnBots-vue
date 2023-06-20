<script setup lang="ts">
import Game from "@/components/Game.vue";
import BlocklyComponent from "@/components/BlocklyComponent.vue";
import {computed, ref} from "vue";
import { javascriptGenerator } from "blockly/javascript";
import Blockly from "blockly";
import { toolboxJson } from "@/toolbox_phaser.js";
import {state} from "@/socket";
import RangeSlider from "@/components/RangeSlider.vue";
import Level4 from "@/App.vue";
import Test from "@/components/Test.vue";

const foo = ref();
const code = ref();
const lvl4 = ref();
let value = ref("");
const playGame = ref(false);
const volume = ref({music: 40,
  sound: 40});
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

let receivedBlocklist = null;
function blockListReceived(blockList) {
  console.log("blockListReceived");
  receivedBlocklist = blockList;
  playGame.value = !playGame.value;
}

function getPlayGameRef() {
  console.log("get func: " + lvl4.value?.playGame);
  return lvl4.value?.playGame;
}
function showCode() {
  code.value = javascriptGenerator.workspaceToCode(foo.value.workspace);
  // saves and prints workspace (for startBlocks or saving options later)
  console.log(Blockly.serialization.workspaces.save(foo.value.workspace));
  playGame.value = !playGame.value;
  console.log(playGame);
  // eval(code.value);
}


</script>

<template>
  <div
    class="flex xl:flex-row flex-col justify-start items-centerr xl:items-start my-24 mx-16"
  >
    <Game
      :playGame="playGame"
      :blockList="receivedBlocklist"
      :volume="volume"
    />
    <div class="flex flex-col justify-start">
    <RangeSlider v-model="volume.music" name="Music Volume"/>
    <RangeSlider v-model="volume.sound" name="Sound Volume"/></div>
    <BlocklyComponent
      class="w-full max-w-[960px] xl:max-w-xl h-96 shrink grow-0"
      id="blockly"
      :options="options"
      ref="foo"
      @runCodePressed="blockListReceived"
    />
  </div>
</template>

<style scoped></style>
