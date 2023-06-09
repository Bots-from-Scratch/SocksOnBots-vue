<script setup>
import { onMounted, ref, shallowRef } from "vue";
import Blockly from "blockly";
import "@/blocks/move_player";
import level4 from "@/components/Level4.vue";
import { toolboxJson } from "@/toolbox_phaser";
import { useLocalStorage } from "@vueuse/core";
import { javascriptGenerator } from "blockly/javascript";
import PixelButton from "@/components/PixelButton.vue";

const emit = defineEmits(["runCodePressed"]);
const props = defineProps(["options"]);
const blocklyToolbox = ref();
const blocklyDiv = ref();
const workspace = shallowRef();
const store = useLocalStorage("userBlocks", null);
let startBlocks;
defineExpose({ workspace });

onMounted(() => {
  const options = props.options || {};
  if (!options.toolbox) {
    options.toolbox = blocklyToolbox.value;
  }

  if (store.value !== "undefined") {
    // localStorage ist definiert
    startBlocks = JSON.parse(store.value);
    console.log(startBlocks);
    // Weitere Aktionen mit dem localStorage durchführen
  } else {
    // localStorage ist undefined
    console.log("localStorage ist nicht verfügbar.");
    // Alternative Aktionen durchführen oder Fehlerbehandlung durchführen
  }

  workspace.value = Blockly.inject(blocklyDiv.value, options);
  console.log(workspace.value);
  if (startBlocks) {
    Blockly.serialization.workspaces.load(startBlocks, workspace.value);
  }
});

var playGame = ref();
// var outputArea = document.getElementById("output");
// var runButton = document.getElementById("runButton");

console.log(startBlocks);
function runCode() {
  console.log("runCode");
  let blockList = [];
  let blockListTmp = [];

  const savedBlocks = Blockly.serialization.workspaces.save(workspace.value);
  store.value = JSON.stringify(savedBlocks);
  console.log(store.value);

  blockList = [];
  javascriptGenerator.init(Blockly.common.getMainWorkspace());

  blockListTmp = Blockly.common.getMainWorkspace().getAllBlocks(true);

  blockListTmp.forEach(function (block) {
    blockList.push(javascriptGenerator.blockToCode(block, true));
  });
  console.log(blockList);
  emit("runCodePressed", blockList);
}
</script>

<template>
  <div class="">
    <div class="h-full w-full" ref="blocklyDiv"></div>
    <div ref="blocklyToolbox">
      <slot></slot>
    </div>
    <div class="flex justify-start my-8">
    <PixelButton text="Play" @click="runCode" /></div>
  </div>
</template>

<style scoped></style>
