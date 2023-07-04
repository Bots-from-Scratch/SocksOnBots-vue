<script setup lang="ts">
const props = defineProps(["text"]);
</script>

<template>
  <div
    class="relative flex items-center justify-center group cursor-pointer duration-[20ms] active:scale-955 active:translate-y-1 active:translate-x-31"
  >
    <img
      class="h-auto z-10"
      src="@/assets/button.svg"
      alt="Pixelart Button"
    />
    <img
      class="absolute group-active:hidden top-1 -left-0.5 h-auto"
      src="@/assets/button-shadow.svg"
      alt="Pixelart Button"
    />
    <p
      class="absolute w-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center font-pixel text-black z-20"
    >
      {{ text }}
    </p>
  </div>
</template>

<style scoped></style>
