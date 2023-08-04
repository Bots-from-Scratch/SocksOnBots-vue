<template>
  <div
    class="flex flex-row gap-16 justify-between pixel-border-16 w-full p-12 pl-14 bg-gray-600 mx-auto my-4"
  >
    <div
      ref="phaserGame"
      class="game-container relative pixel-border-16 w-full"
      id="gameCanvas"
    >
      <transition>
        <div
          v-if="antennaClicked"
          class="noise absolute w-full h-full bg-black top-0 left-0"
        ></div>
      </transition>
    </div>
    <div class="flex flex-col pixel-border-8 gap-8 basis-1/4 bg-stone-700 p-4">
      <div
        v-if="state.activeScene === 'SingleplayerScene'"
        class="grid grid-cols-3 gap-x-8 gap-y-4"
      >
        <div
          v-for="level in storedLevels"
          :key="level.number"
          class="pixel-border-small text-center font-pixel text-black hover:bg-stone-400 cursor-pointer"
          @click="selectLevel(level.number)"
          :class="[
            selectedLevel === level.number ? 'bg-stone-300' : 'bg-stone-500',
          ]"
        >
          {{ level.number }}
        </div>
      </div>
      <div
        v-else-if="state.activeScene === 'MultiplayerScene'"
        class="grid grid-cols-3 gap-x-8 gap-y-4"
      >
        <div
          v-for="message in chatMessages"
          :key="message.id"
          class="pixel-border-small text-center font-pixel text-black hover:bg-stone-400 cursor-pointer"
          @click="selectLevel(message.id)"
          :class="[
            selectedLevel === message.id ? 'bg-stone-300' : 'bg-stone-500',
          ]"
        >
          {{ message.icon }}
        </div>
      </div>
      <SoundControls ref="volumesRef" @volumeChange="controlSounds" />
      <div
        class="pixel-border-small p-2 h-1/2 w-full bg-stone-300 overflow-scroll no-scrollbar"
        @mouseover="isBlinking = false"
        :class="{ blink: isBlinking, 'stop-blink': !isBlinking }"
      >
        <p
          v-if="state.activeScene === 'SingleplayerScene'"
          class="h-2 font-pixel text-xs"
        >
          {{ levels.find((level) => level.number === selectedLevel).text }}
        </p>
        <div
          v-if="state.activeScene === 'MultiplayerScene'"
          class="h-2 font-pixel text-xs"
        >
          <p class="font-pixel text-xs">
            {{ "Du befindest dich in Raum " + state.room.id }}
          </p>

          <p class="mt-4 font-pixel text-xs">
            {{ state.chat?.chatMessage }}
          </p>
        </div>

        <p
          v-if="state.activeScene === 'LobbyMenuScene'"
          class="h-2 font-pixel text-xs"
        >
          {{
            state.room.connects === 0
              ? "Wähle einen Raum aus um gegen einen anderen Spieler anzutreten?"
              : "Warte auf Spieler in Raum " + state.room.id
          }}
        </p>
      </div>
      <div class="pixel-border-small flex flex-row gap-8 bg-stone-800 p-4">
        <PixelButton class="w-1/2" text="Play" @click="playGame" />
        <div class="flex flex-col gap-3">
          <div
            class="pixel-border-small h-3 aspect-square text-white"
            :class="[isPlayingRef ? 'bg-emerald-400' : 'bg-emerald-800']"
          ></div>
          <div
            class="pixel-border-small h-3 aspect-square bg-red-800 text-white"
            :class="[!isPlayingRef ? 'bg-red-400' : 'bg-red-800']"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as Phaser from "phaser";
import { onMounted, onUnmounted, ref, toRaw } from "vue";
import PreloadScene from "@/game/scenes/PreloadScene";
import CutSceneFirstSock from "@/game/scenes/CutSceneFirstSock";
import { leaveRoom, socket, state } from "@/socket";
import { javascriptGenerator } from "blockly/javascript";
import MenuScene from "@/game/scenes/MenuScene";
import LobbyMenuScene from "@/game/scenes/LobbyMenuScene";
import CreditMenuScene from "@/game/scenes/CreditMenuScene";
import PixelButton from "@/components/PixelButton.vue";
import levels from "@/game/levels.json";
import chat from "@/game/chat.json";
import multiplayerLevels from "@/game/levelsMultiplayer.json";
import SoundControls from "@/components/SoundControls.vue";
import { MultiplayerScene } from "@/game/scenes/MultiplayerScene";
import { MultiplayerEndScene } from "@/game/scenes/MultiplayerEndScene";
import { SingleplayerScene } from "@/game/scenes/SingleplayerScene";
import { useLocalStorage } from "@vueuse/core";
import CutScene2 from "@/game/scenes/CutScene2";
import CutScene3 from "@/game/scenes/CutScene3";
import CutScene4 from "@/game/scenes/CutScene4";
import CutScene1 from "@/game/scenes/CutScene1";
// TODO licht/Strom anschalten
// TODO schieben
// TODO

let activeScene = null;
export default {
  name: "Game",
  components: { SoundControls, PixelButton },
  expose: ["activeScene"],
  emits: {
    selectedLevel: null,
    playGamePressed: null,
  },
  props: {
    // directionPlayer1: String,
    playGames: Boolean,
    // volume: Object,
    blocklyWorkspace: Object,
    antennaClicked: true,
    // workspace: Object,
  },
  setup(props, { emit }) {
    let game = ref(null);
    const isBlinking = ref();
    const playGameCounter = ref(0);
    const volumesRef = ref();
    const selectedLevel = ref(0);
    const isSelected = ref(false);
    const isPlayingRef = ref(state.playGame);
    const actScene = ref(null);
    const chatMessage = ref();
    const storeLvl = useLocalStorage(
      "levelProgress",
      JSON.stringify([
        {
          number: 0,
          name: "Level 1",
          x: 3,
          y: 28,
          isActive: false,
          playerStart: { x: 10, y: 36.8 },
          text: "Du entdeckst einen Pfeil. Wahrscheinlich geht es dort weiter!",
        },
      ])
    );
    const storedLevels = ref(JSON.parse(storeLvl.value));
    activeScene = () => {
      if (game.value) {
        return game.value.scene.getScenes(true)[0];
      } else {
        console.warn("Game not loaded");
      }
    };
    const controlSounds = (volume) => {
      let scene = activeScene();
      if (!scene.backgroundSound?.isPlaying) {
        scene.backgroundSound?.play();
      }
      scene.backgroundSound?.setVolume(parseInt(volume.music) / 200);
      scene.collisionSound?.setVolume(parseInt(volume.sound) / 200);
      scene.movingSound?.setVolume(parseInt(volume.sound) / 400);
      scene.collectStarSound?.setVolume(parseInt(volume.sound) / 200);
      scene.collectKeySound?.setVolume(parseInt(volume.sound) / 200);
      scene.doorSound?.setVolume(parseInt(volume.sound) / 200);
      scene.movingObjectSound?.setVolume(parseInt(volume.sound) / 200);
      scene.hoverSound?.setVolume(parseInt(volume.sound) / 200);
    };

    const runGame = () => {
      runBlocks(props.blocklyWorkspace.value);
      controlSounds(volumesRef.value.volume);
      playGameCounter.value++;
    };

    const playGame = () => {
      if (state.activeScene === "MultiplayerScene") {
        socket.emit(
          "playGame",
          { playGame: true, roomId: state.room.id },
          () => {}
        );
        // this.isPlayingRef = !this.isPlayingRef
        // !state.playGame && runGame();
      } else if (state.activeScene === "SingleplayerScene") {
        runGame();
      }
    };

    const saveFinishedLevelToStorage = (newLevel) => {
      const lvlToSave = levels.find((level) => level.number === newLevel);
      // TODO level zu name oder levelName umbenennen
      const dataToStore = [];
      if (storeLvl.value !== null) {
        const storedData = JSON.parse(storeLvl.value);
        storedData.forEach((level) => {
          level.number !== lvlToSave.number && dataToStore.push(level);
        });
      }
      dataToStore.push(lvlToSave);

      storeLvl.value = JSON.stringify(dataToStore);
    };

    const updateSelectedLevel = (newLevel) => {
      if (
        !storedLevels.value.some((lvl) => lvl.number === newLevel) &&
        state.activeScene === "SingleplayerScene"
      ) {
        saveFinishedLevelToStorage(newLevel);
        storedLevels.value = JSON.parse(storeLvl.value);
      }
      selectedLevel.value = newLevel;
      selectLevel(newLevel);
    };
    onUnmounted(() => {
      if (state.room.id) {
        leaveRoom();
      }
      state.activeScene = null;
      activeScene()?.sys.game.destroy(true);
    });
    onMounted(() => {
      emit("selectedLevel", selectedLevel.value);
    });
    const selectLevel = (levelNumber) => {
      if (state.activeScene === "SingleplayerScene") {
        selectedLevel.value = levelNumber;
        emit("selectedLevel", selectedLevel.value);
        activeScene().prepareLevel(selectedLevel.value);
        // isSelected.value = !isSelected.value;
      } else if (state.activeScene === "MultiplayerScene") {
        socket.emit("chat", {
          roomId: state.room.id,
          msg: chat.find((msg) => msg.id === levelNumber),
        });
      }

      isSelected.value = !isSelected.value;
      isBlinking.value = true;
    };

    return {
      props,
      game,
      runGame,
      controlSounds,
      activeScene,
      updateSelectedLevel,
      selectedLevel,
      playGame,
      playGameCounter,
      selectLevel,
      isSelected,
      isPlayingRef,
      volumesRef,
      isBlinking,
      storedLevels,
      chatMessage,
    };
  },

  data() {
    return {
      levels: levels,
      chatMessages: chat,
    };
  },

  computed: {
    state() {
      return state;
    },
  },

  watch: {
    /**
     * Beschreibung von selectedLevel
     */
    selectedLevel() {
      socket.emit("selectedLevel", {
        roomId: state.room.id,
        level: this.selectedLevel,
      });
      // this.activeScene.scene.restart();
    },
    "state.playGame": {
      handler() {
        this.isPlayingRef = !this.isPlayingRef;
        this.runGame();
      },
    },
    // "state.chat": {
    //   handler(newValue) {
    //     console.log("=>(Game.vue:319) newValue", newValue);
    //
    //     this.chatMessage.value = newValue.chatMessage;
    //   },
    // },
    // "state.selectedLevel": {
    //   handler(newValue) {
    //     selectedGameLevel = newValue;
    //     this.$emit("selectedLevel", selectedGameLevel);
    //     if (this.game) {
    //       const lvl = levels.find((lvl) => lvl.number === this.selectedLevel);
    //       console.log("=>(Game.vue:237) lvl", lvl);
    //       this.activeScene().prepareLevel(lvl);
    //     }
    //   },
    //   immediate: true,
    // },
  },

  mounted() {
    gameConfig = {
      type: Phaser.AUTO,
      parent: this.$refs.phaserGame,
      width: 960,
      height: 640,
      scene: [
        MenuScene,
        LobbyMenuScene,
        CutScene1,
        CutScene2,
        CutScene3,
        CutScene4,
        CreditMenuScene,
        new MultiplayerScene(
          this.selectedLevel,
          multiplayerLevels,
          this.updateSelectedLevel
        ),
        new SingleplayerScene(
          this.selectedLevel,
          levels,
          this.updateSelectedLevel
        ),
        MultiplayerEndScene,
        PreloadScene,
        CutSceneFirstSock,
      ],
      physics: {
        default: "arcade",
        arcade: {
          debug: true,
        },
      },
      input: { mouse: { preventDefaultWheel: false } },
      pixelArt: true,
    };
    this.game = new Phaser.Game(gameConfig);

    setTimeout(() => {
      state.activeScene = activeScene().scene.key;
    }, 1000);
  },
};

let gameConfig;
let selectedGameLevel;

function runBlocks(workspace) {
  javascriptGenerator.STATEMENT_PREFIX = "highlightBlock(%1);\n";
  javascriptGenerator.addReservedWords("highlightBlock");
  const highlightBlock = (id) => {
    workspace.highlightBlock(id);
  };
  const code = javascriptGenerator.workspaceToCode(workspace);
  activeScene().createGeneratorFunction(code, highlightBlock, activeScene());
}
</script>

<style>
.game-container > canvas {
  width: 100%;
}

.pixel-border-small {
  box-shadow: -4px 0 0 0 black, 4px 0 0 0 black, 0 -4px 0 0 black,
    0 4px 0 0 black;
}

.pixel-border-8 {
  box-shadow: -8px 0 0 0 black, 8px 0 0 0 black, 0 -8px 0 0 black,
    0 8px 0 0 black;
}

.pixel-border-16 {
  box-shadow: -16px 0 0 0 black, 16px 0 0 0 black, 0 -16px 0 0 black,
    0 16px 0 0 black;
}

.highlighted {
  filter: drop-shadow(0 0 0.5rem crimson);
}

.v-enter-active,
.v-leave-active {
  transition: all 0.5s;
}
.v-enter-to {
  transform: scale(1);
  background-color: whitesmoke;
}

.noise {
  background: repeating-radial-gradient(#000 0 0.0001%, #fff 0 0.0002%) 50% 0/2500px
      2500px,
    repeating-conic-gradient(#000 0 0.0001%, #fff 0 0.0002%) 60% 60%/2500px
      2500px;
  background-blend-mode: difference;
  animation: b 0.2s infinite alternate;
}
@keyframes b {
  100% {
    background-position: 50% 0, 60% 50%;
  }
}

@keyframes blink {
  0% {
    background-color: #f5f5f4;
  }
  50% {
    background-color: #a8a29e;
  }
  100% {
    background-color: #f5f5f4;
  }
}

.blink {
  animation: blink 1s infinite;
}

.stop-blink {
  animation: none;
}
</style>
