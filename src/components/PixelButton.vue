<script setup lang="ts">
const props = defineProps(["text"]);
</script>

<template>
  <div class="relative flex items-center flex-col cursor-pointer w-max">
    <img src="src/assets/button.svg" alt="Pixelart Button" />
    <p
      class="absolute w-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center font-pixel"
    >
      {{ text }}
    </p>
  </div>
</template>

<style scoped></style>
