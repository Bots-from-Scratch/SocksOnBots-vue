<script setup>
import { ref } from "vue";
import BlocklyComponent from "./components/BlocklyComponent.vue";
import "./blocks/stocks";
import Blockly from "blockly";

import { javascriptGenerator } from "blockly/javascript";
import { toolboxJson } from "@/toolbox_phaser";
import Game from "@/components/Game.vue";
import Level4 from "@/components/Level4.vue";
import {data} from "autoprefixer";


const foo = ref();
const code = ref();
const lvl4 = ref();
let value = ref("");
const playGame = ref(false);
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
  console.log(playGame)
  // eval(code.value);
}
</script>

<template>
  <div
    id="app"
    class="flex flex-row justify-center shrink-0 flex-wrap m-8 w-screen"
  >
    <div>
      <img alt="Vue logo" src="./assets/logo.png" class="w-12 h-12" />
      <div id="code" class="w-12 h-12 bg-amber-100 rounded text-center">
        <button @click="showCode()" class="">Play</button>
      </div>
      <span>{{playGame}}</span>

    </div>
    <BlocklyComponent
      class="w-96 h-96"
      id="blockly"
      :options="options"
      ref="foo"
      @runCodePressed="blockListReceived"
    ></BlocklyComponent>
    <!--      <pre v-html="code"></pre>-->

    <!--    <Game />-->
    <!--      <p>{{value}}</p>-->
    <!--      <p>{{ getPlayGameRef }}</p>-->

    <Level4 :direction="value" :playGame="playGame" :blockList="receivedBlocklist"/>
  </div>
</template>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>
