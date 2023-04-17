<script setup>
import { onMounted, onUnmounted } from 'vue'
import { Game } from 'phaser'

let gameInstance = null
const containerId = 'game-container'
const game = await import('@/game/game')

onMounted(() => {
  gameInstance = game.launch(containerId)
})

onUnmounted(() => {
  gameInstance?.destroy(false)
})
</script>

<template>
  <div :id="containerId" />
</template>
