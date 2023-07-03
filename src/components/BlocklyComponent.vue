<script setup>
import { computed, onMounted, ref, shallowRef, watch } from "vue";
import Blockly from "blockly";
import "@/blocks/move_player";
import { useLocalStorage } from "@vueuse/core";
import PixelButton from "@/components/PixelButton.vue";
import { socket, state } from "@/socket";

const emit = defineEmits(["playGamePressed", "workspaceFromBlockly"]);
const props = defineProps(["options", "selectedLevel"]);
const blocklyToolbox = ref();
const blocklyDiv = ref();
const workspace = shallowRef();
let playGameCounter = 0;
let store = useLocalStorage("userBlocks", null);
defineExpose({ workspace });

onMounted(() => {
  const options = props.options || {};
  if (!options.toolbox) {
    options.toolbox = blocklyToolbox.value;
  }

  workspace.value = Blockly.inject(blocklyDiv.value, options);

  emit("workspaceFromBlockly", workspace);

  loadBlocksFromStorage(props.selectedLevel);

  workspace.value.addChangeListener(function (event) {
    if (
      event.type === Blockly.Events.BLOCK_DRAG ||
      event.type === Blockly.Events.BLOCK_CHANGE
    ) {
      console.log("=>(BlocklyComponent.vue:39) drag");
      saveBlocksToStorage();
    }
  });
});

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
    Blockly.getMainWorkspace() && loadBlocksFromStorage(newLevel);
  }
);

function loadBlocksFromStorage(newLevel) {
  Blockly.serialization.workspaces.load([], workspace.value);
  if (store.value !== null) {
    const startBlocks = JSON.parse(store.value);
    startBlocks.forEach((level) => {
      parseInt(level.level) === parseInt(newLevel) &&
        Blockly.serialization.workspaces.load(level.blocks, workspace.value);
    });
  } else {
    console.log("localStorage ist nicht verfügbar.");
  }
}

function saveBlocksToStorage() {
  const blocksToSave = Blockly.serialization.workspaces.save(workspace.value);
  // TODO level zu name oder levelName umbenennen
  const dataToStore = [];
  if (store.value !== null) {
    const storedData = JSON.parse(store.value);
    storedData.forEach((level) => {
      level.level !== props.selectedLevel && dataToStore.push(level);
    });
  }
  dataToStore.push({ level: props.selectedLevel, blocks: blocksToSave });

  store.value = JSON.stringify(dataToStore);
}
</script>

<template>
  <div class="w-full">
    <div ref="blocklyDiv" class="h-full"></div>
    <div ref="blocklyToolbox">
      <slot></slot>
    </div>
    <div class="flex justify-start my-8">
      <p>{{ directionObj }}</p>
    </div>
  </div>
</template>

<style scoped></style>
