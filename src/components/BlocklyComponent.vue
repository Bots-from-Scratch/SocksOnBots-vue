<script setup>
import { computed, onMounted, ref, shallowRef, watch } from "vue";
import Blockly from "blockly";
import "@/blocks/move_player";
import { useLocalStorage } from "@vueuse/core";
import { javascriptGenerator } from "blockly/javascript";
import PixelButton from "@/components/PixelButton.vue";
import { socket, state } from "@/socket";

const emit = defineEmits(["runCodePressed","workspace"]);
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
    startBlocks = JSON.parse(store.value);
    console.log(startBlocks);
  } else {
    console.log("localStorage ist nicht verfügbar.");
  }

  workspace.value = Blockly.inject(blocklyDiv.value, options);
  console.log(workspace.value);
  if (startBlocks) {
    Blockly.serialization.workspaces.load(startBlocks, workspace.value);
  }

  emit("workspace", workspace);

  workspace.value.addChangeListener(function (event) {
    console.log("workspace.value.addChangeListener");
    console.log(event);
    if (event.type === Blockly.Events.BLOCKSPACE_CHANGE) {
      if (event.element === "blocklyBlockSpaceStart") {
        var blockId = event.blockId;
        console.log("blockID", blockId);
      } else if (event.element === "blocklyBlockSpaceEnd") {
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

watch(
  () => state.playGame,
  () => {
    console.log("watcher state.playGame blocklyComponent");
    runCode();
  }
);

console.log(startBlocks);
function runCode() {
  console.log("runCode");

  const savedBlocks = Blockly.serialization.workspaces.save(workspace.value);
  store.value = JSON.stringify(savedBlocks);

  javascriptGenerator.init(Blockly.common.getMainWorkspace());

  emit("runCodePressed");
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
