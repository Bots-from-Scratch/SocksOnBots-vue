<script setup>
import { computed, onMounted, onUnmounted, ref, shallowRef, watch } from "vue";
import Blockly from "blockly";
import "@/blocks/move_player";
import { useLocalStorage } from "@vueuse/core";
import { state } from "@/socket";
import { toolboxJson } from "@/toolbox_phaser";
import { CustomRenderer } from "@/renderer/CustomRenderer";

const emit = defineEmits(["playGamePressed", "workspaceFromBlockly"]);
const props = defineProps(["options", "selectedLevel"]);
const blocklyToolbox = ref();
const blocklyDiv = ref();
const workspace = shallowRef();
let playGameCounter = 0;
let store = useLocalStorage("userBlocks", null);
defineExpose({ workspace });

const blockStyles = {
  loop_blocks: {
    colourPrimary: "#ff0000",
    colourSecondary: "#00ff00",
    colourTertiary: "#0000ff",
  },
};

Blockly.Theme.defineTheme("dark", {
  base: Blockly.Themes.Classic,
  componentStyles: {
    workspaceBackgroundColour: "#1e1f22",
    toolboxBackgroundColour: "blackBackground",
    toolboxForegroundColour: "#fff",
    flyoutBackgroundColour: "#252526",
    flyoutForegroundColour: "#ccc",
    flyoutOpacity: 1,
    scrollbarColour: "#797979",
    insertionMarkerColour: "#fff",
    insertionMarkerOpacity: 0.3,
    scrollbarOpacity: 0.4,
    blockStyles: blockStyles,
    cursorColour: "#d0d0d0",
    blackBackground: "#2b2d30",
  },
});

const blocklyOptions = {
  renderer: "customRenderer",
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
    colour: "#393b40",
    snap: true,
  },
  theme: "dark",
};

onUnmounted(() => {
  Blockly.registry.unregister("theme", "dark");
  Blockly.registry.unregister("renderer", "customRenderer");
});

onMounted(() => {
  const options = props.options || {};
  if (!options.toolbox) {
    options.toolbox = blocklyToolbox.value;
  }

  Blockly.blockRendering.register("customRenderer", CustomRenderer);

  workspace.value = Blockly.inject(blocklyDiv.value, blocklyOptions);

  emit("workspaceFromBlockly", workspace);

  if (state.activeScene === "SingleplayerScene") {
    loadBlocksFromStorage(props.selectedLevel);
  }

  workspace.value.addChangeListener(function (event) {
    if (
        (event.type === Blockly.Events.BLOCK_DRAG ||
      event.type === Blockly.Events.BLOCK_CHANGE) && state.activeScene === "SingleplayerScene"
    ) {
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
    console.error("localStorage ist nicht verfügbar.");
  }
}

function saveBlocksToStorage() {
  const blocksToSave = Blockly.serialization.workspaces.save(workspace.value);
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
  </div>
</template>

<style scoped></style>
