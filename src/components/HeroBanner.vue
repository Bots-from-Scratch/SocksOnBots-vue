<script setup lang="ts">
import PixelButton from "@/components/PixelButton.vue";
</script>

<template>
  <div
    class="w-full h-max md:h-max bg-hero-image bg-cover bg-center flex flex-col-reverse items-center justify-evenly gap-16 md:flex-row"
  >
    <router-link to="/">
      <img src="@/assets/robot.png" alt="Roboter in Pixelart" />
    </router-link>
    <div class="flex flex-col gap-16 items-start px-16 md:p-0 my-12">
      <h2 class="font-pixel text-gray-800 text-[10vw] sm:leading-snug sm:text-6xl">
        Lost your sock lately?
      </h2>
      <router-link to="/game">
        <PixelButton text="Get it back!" />
      </router-link>
    </div>
  </div>
</template>

<style scoped></style>
