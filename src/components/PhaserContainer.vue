<template>
  <div class="game-container" :id="containerId" />
<!--  <div class="bg-amber-600">{{ playGame }}</div>-->
</template>

<script setup>
import { onMounted, onUnmounted, ref, watch } from "vue";
import { runBlocks } from "@/components/Level4.vue";

const props = defineProps(["playGame","blockList"]);

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
  }
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
