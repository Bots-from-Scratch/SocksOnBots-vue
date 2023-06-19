<template>
  <div class="game-container" :id="containerId" />
</template>

<script setup>
import { onMounted, onUnmounted, ref, watch } from "vue";
import { runBlocks, GameScene } from "@/components/Level4.vue";
import Level4 from "@/App.vue";

const props = defineProps(["playGame", "blockList", "volume"]);

let gameInstance = null;
const containerId = "game-container";
const game = await import("@/game/game");
const value = "VALUE";
onMounted(() => {
  gameInstance = game.launch(containerId);
  console.log(gameInstance.scene.getScenes());
});

watch(
  () => props.playGame,
  () => {
    console.log(props.blockList);
    runBlocks(props.blockList);
    gameInstance.scene.scenes[0].playBackgroundSound(props.volume.music / 200);
  }
);

watch(
  () => props.volume,
  () => {
    if (gameInstance) {
      let scene = gameInstance.scene.getScenes(true);
      console.log(scene[0]);
      scene[0].backgroundSound.setVolume(
        props.volume.music / 200
      );
      scene[0].collisionSound.setVolume(
        props.volume.sound / 200
      );
    }
  },
  { deep: true, immediate: true }
);

onUnmounted(() => {
  gameInstance?.destroy(false);
});
</script>

<style>
.game-container > canvas {
  width: 100%;
}
</style>
