<script setup>
import { computed, onMounted, ref, shallowRef, watch } from "vue";
import Blockly from "blockly";
import "@/blocks/move_player";
import { useLocalStorage } from "@vueuse/core";
import { javascriptGenerator } from "blockly/javascript";
import PixelButton from "@/components/PixelButton.vue";
import { socket, state } from "@/socket";

const emit = defineEmits(["runCodePressed", "workspace"]);
const props = defineProps(["options", "selectedLevel"]);
const blocklyToolbox = ref();
const blocklyDiv = ref();
const workspace = shallowRef();
let store = useLocalStorage("userBlocks", null);
let startBlocks;
let runCodeCounter = 0;
defineExpose({ workspace });

onMounted(() => {
  const options = props.options || {};
  if (!options.toolbox) {
    options.toolbox = blocklyToolbox.value;
  }

  workspace.value = Blockly.inject(blocklyDiv.value, options);
  console.log(workspace.value);
  if (startBlocks) {
    Blockly.serialization.workspaces.load(startBlocks.blocks, workspace.value);
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
  () => props.selectedLevel,
  (newLevel) => {
    // store = useLocalStorage("userBlocks".concat(newLevel), null);

    if (store.value !== null) {
      console.log("=>(BlocklyComponent.vue:65) store.value", store.value);
      startBlocks = JSON.parse(store.value);
      console.log(startBlocks.blocks);
    } else {
      console.log("localStorage ist nicht verfügbar.");
    }

    console.log(workspace.value);
    if (startBlocks) {
      startBlocks.forEach(
        (level) =>
          level.level === newLevel &&
          Blockly.serialization.workspaces.load(level.blocks, workspace.value)
      );
      // Blockly.serialization.workspaces.load(
      //   startBlocks.blocks,
      //   workspace.value
      // );
    }
  }
);

watch(
  () => state.playGame,
  () => {
    console.log("watcher state.playGame blocklyComponent");
    // runCodeCounter === 0 && runCode();
     runCode();
  }
);

console.log(startBlocks);
function runCode() {
  runCodeCounter++;
  console.log("=>(BlocklyComponent.vue:99) runCodeCounter", runCodeCounter);
  console.log("runCode");

  const savedBlocks = Blockly.serialization.workspaces.save(workspace.value);
  // TODO Blöcke für Level speichern
  // TODO level zu name oder levelName umbenennen
  const dataToStore = [];
  const storedData = JSON.parse(store.value);
  storedData.forEach((level) => {
    level.level !== props.selectedLevel && dataToStore.push(level);
  });

  console.log("=>(BlocklyComponent.vue:108) storedData", dataToStore);

  dataToStore.push({ level: props.selectedLevel, blocks: savedBlocks });
  console.log(
    "=>(BlocklyComponent.vue:99) dataToStore after push",
    dataToStore
  );

  // console.log(
  //   "=>(BlocklyComponent.vue:82) this.selectedLevel",
  //   props.selectedLevel
  // );
  // store = useLocalStorage(
  //   "userBlocks",
  //   JSON.stringify(dataToStore)
  // );
  store.value = JSON.stringify(dataToStore);
  // useLocalStorage(
  //   "userBlocks".concat(props.selectedLevel),
  //   JSON.stringify(dataToStore)
  // );
  javascriptGenerator.init(Blockly.common.getMainWorkspace());

  emit("runCodePressed");
  socket.emit("playGame", {playGame: true, roomId: state.roomID});
}
</script>

<template>
  <div class="w-full">
    <div class="h-full" ref="blocklyDiv"></div>
    <div ref="blocklyToolbox">
      <slot></slot>
    </div>
    <div class="flex justify-start my-8">
      <PixelButton text="Play" @click="state.playGame = true" />
      <p>{{ directionObj }}</p>
    </div>
  </div>
</template>

<style scoped></style>
