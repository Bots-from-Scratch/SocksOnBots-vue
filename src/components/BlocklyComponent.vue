<script setup>
import {computed, onMounted, ref, shallowRef, watch} from "vue";
import Blockly from "blockly";
import "@/blocks/move_player";
import { useLocalStorage } from "@vueuse/core";
import { javascriptGenerator } from "blockly/javascript";
import PixelButton from "@/components/PixelButton.vue";
import { socket, state } from "../socket";

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



  workspace.value.addChangeListener(function(event) {
    console.log("workspace.value.addChangeListener");
    console.log(event)
    if (event.type === Blockly.Events.BLOCKSPACE_CHANGE) {
      if (event.element === 'blocklyBlockSpaceStart') {
        var blockId = event.blockId;
        console.log("blockID", blockId);
        // Hier kannst du den blockId-Wert verwenden, der den gerade gestarteten Block identifiziert
      } else if (event.element === 'blocklyBlockSpaceEnd') {
        // Hier kannst du entsprechende Aktionen ausführen, wenn die Blockausführung beendet ist
      }
    }
  });
});

// var playGame = ref();
let playGame = computed({
  get() {
    return state.playGame;
  },
});

const directionObj = computed({
  get() {
    return state.direction;
  },
});
// var outputArea = document.getElementById("output");
// var runButton = document.getElementById("runButton");

watch(() => state.playGame, () => {
  console.log("watcher state.playGame blocklyComponent")
  runCode();
})


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
  var lastBlockId = workspace.value;
  console.log("Zuletzt ausgeführter Block: ", lastBlockId);
  blockListTmp.forEach(function (block) {
    // TODO push blockCode + blockId to blockList
    let _block = {id: block.id, code: javascriptGenerator.blockToCode(block, true)}
    blockList.push(_block);
  });
  console.log(blockList);
  emit("runCodePressed", blockList);
  socket.emit("playGame", true);
}
</script>

<template>
  <div class="w-full">
    <div class="h-full" ref="blocklyDiv"></div>
    <div ref="blocklyToolbox">
      <slot></slot>
    </div>
    <div class="flex justify-start my-8">
      <PixelButton text="Play" @click="runCode" />
      <p>{{ directionObj }}</p>
    </div>
  </div>
</template>

<style scoped></style>
