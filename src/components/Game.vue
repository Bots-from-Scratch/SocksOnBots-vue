<script setup>
import PhaserContainer from '@/components/PhaserContainer.vue'

defineProps(["playGame","blockList"])
</script>

<template>
  <Suspense>
    <PhaserContainer :playGame="playGame" :blockList="blockList"/>

    <template #fallback>
      <div class="placeholder">
        Downloading ...
      </div>
    </template>
  </Suspense>
</template>

<style scoped>
.placeholder {
  font-size: 2rem;
  font-family: 'Courier New', Courier, monospace;
}
</style>
