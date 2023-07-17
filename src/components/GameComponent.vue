<script setup lang="ts">
import BlocklyComponent from "@/components/BlocklyComponent.vue";
import {onDeactivated, onMounted, onUnmounted, ref, watch} from "vue";
import { toolboxJson } from "@/toolbox_phaser.js";
import { leaveRoom, state } from "@/socket";
import RangeSlider from "@/components/RangeSlider.vue";
import Game from "@/components/Game.vue";
import { useLocalStorage } from "@vueuse/core";

const blockly = ref(null);
let blocklyWorkspace = ref();
const playGame = ref(state.playGame);
const game = ref(null);
const selectedLevel = ref("");

const blocklyOptions = {
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

function sendBlocklyWorkspaceToGame(workspace) {
  blocklyWorkspace.value = workspace;
}

function levelSelected(data) {
  selectedLevel.value = data;
}

// Create the keyframes
const wobbleTopOnHoverKeyframes = `
  @-webkit-keyframes wobble-top-on-hover {
    16.65% {
      -webkit-transform: skew(-12deg);
      transform: skew(-12deg);
    }
    33.3% {
      -webkit-transform: skew(10deg);
      transform: skew(10deg);
    }
    49.95% {
      -webkit-transform: skew(-6deg);
      transform: skew(-6deg);
    }
    66.6% {
      -webkit-transform: skew(4deg);
      transform: skew(4deg);
    }
    83.25% {
      -webkit-transform: skew(-2deg);
      transform: skew(-2deg);
    }
    100% {
      -webkit-transform: skew(0);
      transform: skew(0);
    }
  }
  @keyframes wobble-top-on-hover {
    16.65% {
      -webkit-transform: skew(-12deg);
      transform: skew(-12deg);
    }
    33.3% {
      -webkit-transform: skew(10deg);
      transform: skew(10deg);
    }
    49.95% {
      -webkit-transform: skew(-6deg);
      transform: skew(-6deg);
    }
    66.6% {
      -webkit-transform: skew(4deg);
      transform: skew(4deg);
    }
    83.25% {
      -webkit-transform: skew(-2deg);
      transform: skew(-2deg);
    }
    100% {
      -webkit-transform: skew(0);
      transform: skew(0);
    }
  }
`;

onMounted(() => {
  const styleElement = document.createElement("style");
  styleElement.innerHTML = wobbleTopOnHoverKeyframes;
  document.head.appendChild(styleElement);

  const element = document.querySelector(".wobble-top-on-hover");
  element.classList.add("wobble-top-on-hover");
  element.addEventListener("mouseover", () => playAnimation());

  function playAnimation() {
    console.log("=>(GameComponent.vue:114) ");
    element.classList.add("wobble-top-on-hover-animation");
    setTimeout(
      () => element.classList.remove("wobble-top-on-hover-animation"),
      1000
    );
  }
});

let antennaClicked = ref(false);

onUnmounted(() => {
  if (state.roomID) {
    leaveRoom();
  }
  state.activeScene = null;
});
</script>

<template>
  <div class="bg-hero-image">
    <div
      class="flex flex-col items-center justify-center relative wobble-top-on-hover w-max h-max left-3/4"
      @click="antennaClicked = !antennaClicked"
    >
      <div
        class="flex flex-col items-center mt-8"
        :class="{
          'rotate-[120deg] translate-y-20 translate-x-12': antennaClicked,
        }"
      >
        <div class="pixel-border-small mb-1 w-8 h-8 bg-stone-500"></div>
        <div class="pixel-border-small-top w-2 h-16 bg-stone-500"></div>
      </div>
      <div class="pixel-border-small-bottom w-2 h-24 bg-stone-500"></div>
    </div>
    <div
      class="flex flex-col justify-start items-center xl:items-start mt-487 mb-12 mx-16"
    >
      <Game
        :playGame="playGame"
        :blocklyWorkspace="blocklyWorkspace"
        ref="game"
        :antennaClicked="antennaClicked"
        @selectedLevel="levelSelected"
        class="z-10"
      />
      <transition name="blockly">
        <BlocklyComponent
          v-if="
            state.activeScene === 'SingleplayerScene' ||
            state.activeScene === 'MultiplayerScene'
          "
          class="pixel-border-8 bg-gray-600 p-4 w-full h-[32rem] shrink grow-0"
          id="blockly"
          :options="blocklyOptions"
          :selectedLevel="selectedLevel"
          ref="blockly"
          @workspaceFromBlockly="sendBlocklyWorkspaceToGame"
      /></transition>
    </div>
  </div>
</template>

<style scoped>
.blockly-enter-active,
.blockly-leave-active {
  transition: all 0.5s;
}
.blockly-enter-from {
  transform: translateY(-50%);
}

.wobble-top-on-hover {
  //display: inline-block;
  vertical-align: middle;
  -webkit-transform: perspective(1px) translateZ(0);
  transform: perspective(1px) translateZ(0);
  box-shadow: 0 0 1px rgba(0, 0, 0, 0);
  -webkit-transform-origin: 0 100%;
  transform-origin: 0 100%;
}
.wobble-top-on-hover-animation {
  -webkit-animation-name: wobble-top-on-hover;
  animation-name: wobble-top-on-hover;
  -webkit-animation-duration: 1s;
  animation-duration: 1s;
  -webkit-animation-timing-function: ease-in-out;
  animation-timing-function: ease-in-out;
  -webkit-animation-iteration-count: 1;
  animation-iteration-count: 1;
}

.pixel-border-small-bottom {
  box-shadow: -4px 0 0 0 black, 4px 0 0 0 black, 0 0 0 0 black, 0 4px 0 0 black;
}
.pixel-border-small-top {
  box-shadow: -4px 0 0 0 black, 4px 0 0 0 black, 0 0 0 0 black, 0 0 0 0 black;
}
.pixel-border-small {
  box-shadow: -4px 0 0 0 black, 4px 0 0 0 black, 0 -4px 0 0 black,
    0 4px 0 0 black;
}
.pixel-border-8 {
  box-shadow: -8px 0 0 0 black, 8px 0 0 0 black, 0 -8px 0 0 black,
    0 8px 0 0 black;
}
</style>
