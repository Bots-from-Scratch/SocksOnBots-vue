<script setup lang="ts">
import PixelButton from "@/components/PixelButton.vue";
</script>

<template>
  <div
    class="w-full h-max md:h-[50vh] bg-hero-image bg-cover bg-center flex flex-col-reverse items-center justify-betweenn justify-evenly gap-16 md:flex-row"
  >
    <img
      src="src/assets/robot.png"
      alt="Roboter in Pixelart"
      class="-scale-x-100"
    />
    <div class="flex flex-col gap-16 items-start px-16 pt-24 md:p-0">
      <h2 class="font-pixel text-gray-800 text-[10vw] sm:leading-snug sm:text-6xl">Lost your sock lately?</h2>
      <router-link to="/game">
        <PixelButton text="Get it back!"/>
      </router-link>
    </div>
  </div>
</template>

<style scoped></style>
