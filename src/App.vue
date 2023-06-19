<script setup>
import { ref } from "vue";
import BlocklyComponent from "./components/BlocklyComponent.vue";
import "./blocks/stocks";
import Blockly from "blockly";

import { javascriptGenerator } from "blockly/javascript";
import { toolboxJson } from "@/toolbox_phaser";
import Level4 from "@/components/Level4.vue";
import { data } from "autoprefixer";
import AppLayout from "@/layouts/AppLayout.vue";
import Footer from "@/components/Footer.vue";
import Header from "@/components/Header.vue";

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
  console.log(playGame);
  // eval(code.value);
}
</script>

<template>
  <AppLayout />
</template>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

//body{ overflow-x: hidden}
</style>
